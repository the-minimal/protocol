import { error } from "@the-minimal/error";

const encoder = new TextEncoder();
const EncodeError = error("EncodeError");

let POOL_BUFFER = new Uint8Array(128_000);
let POOL_LAYOUT = new Uint8Array(128);
let FREE_CHUNKS = 128;

const alloc = (chunks) => {
	if (FREE_CHUNKS < chunks) {
		refill();
	}

	let count = 0;

	for (let i = 0; i < 128; ++i) {
		if (POOL_LAYOUT[i] === 0) {
			if (count++ === chunks) {
				const layout_start = i - chunks;
				const layout_end = i;
				const offset = layout_start * 1_000;

				POOL_LAYOUT.fill(1, layout_start, layout_end);
				FREE_CHUNKS -= chunks;

				const array = POOL_BUFFER.subarray(offset, layout_end * 1_000);

				return {
					i: POOL_BUFFER,
					b: array.buffer,
					a: array,
					v: new DataView(array.buffer),
					o: offset,
					s: layout_start,
					e: layout_end,
					c: chunks,
				};
			}
		} else {
			count = 0;
		}
	}

	refill();

	return alloc(chunks);
};

const refill = () => {
	POOL_BUFFER = new Uint8Array(128_000);
	POOL_LAYOUT = new Uint8Array(128);
	FREE_CHUNKS = 128;
};

const free = (state) => {
	if (POOL_BUFFER === state.i) {
		POOL_LAYOUT.fill(0, state.s, state.e);
		FREE_CHUNKS += state.c;
	}
};

const ENCODE_TYPES = [
	(state, _1, _2, value) => {
		state.v.setUint8(state.o++, +value);
	},
	(state, _, index, value) => {
		state.v[`setUint${(index - 10) * 8}`](state.o, value);

		state.o += index - 10;
	},
	(state, _, index, value) => {
		state.v[`setInt${(index - 20) * 8}`](state.o, value);
		state.o += index - 20;
	},
	(state, _, index, value) => {
		state.v[`setFloat${(index - 30) * 8}`](state.o, value);
		state.o += index - 30;
	},
	(state, _, index, value) => {
		const isAscii = index < 45;
		const size = index - (isAscii ? 40 : 45);

		if (isAscii) {
			state.v[`setUint${size * 8}`](state.o, value.length);

			state.o += size;

			for (let i = 0; i < value.length; ++i) {
				state.v.setUint8(state.o++, value.charCodeAt(i));
			}
		} else {
			const written = encoder.encodeInto(
				value,
				new Uint8Array(state.b, state.o + size),
			).written;

			state.v[`setUint${size * 8}`](state.o, written);
			state.o += size + written;
		}
	},
	(state, type, _, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			runEncode(state, type.value[i], value[type.value[i].key]);
		}
	},
	(state, type, index, value) => {
		state.v[`setUint${(index - 60) * 8}`](state.o, value.length);

		state.o += index - 60;

		for (let i = 0; i < value.length; ++i) {
			runEncode(state, type.value, value[i]);
		}
	},
	(state, type, _, value) => {
		state.v.setUint8(state.o++, type.value.indexOf(value));
	},
	(state, type, _, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			runEncode(state, type.value[i], value[i]);
		}
	},
];

const runEncode = (state, type, value) => {
	let index = type.type;

	if (index > 99) {
		index -= 100;

		state.v.setUint8(state.o++, +(value === null));

		if (value === null) {
			state.v.setUint8(state.o++, 0);

			return;
		}
	}

	type.assert?.(value);

	ENCODE_TYPES[(index / 10) | 0](state, type, index, value);
};

const encode = (type, value, chunks = 1) => {
	try {
		const state = alloc(chunks);

		runEncode(state, type, value);

		const result = state.b.slice(0, state.o);

		free(state);

		return result;
	} catch (e) {
		EncodeError(e, e?.message);
	}
};

export { encode };
