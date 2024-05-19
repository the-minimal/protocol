import { error } from "@the-minimal/error";

const encoder = new TextEncoder();
const EncodeError = error("EncodeError");

let MEMORY_POOL = new Uint8Array(128_000);
let MEMORY_VIEW = new DataView(MEMORY_POOL.buffer);
let MEMORY_LAYOUT = 0b0000000000000000000000000000000000000000000000000000000000000000;

const alloc = (c) => {
	for (let i = 0; i < 64 - c; ++i) {
		if ((MEMORY_LAYOUT & (((1 << c) - 1) << (64 - c - i))) === 0) {
			MEMORY_LAYOUT |= ((1 << c) - 1) << (64 - c - i);

			return {
				b: MEMORY_POOL,
				v: MEMORY_VIEW,
				o: 2 * i * 1000,
				x: 0,
				i,
				c,
			};
		}
	}

	MEMORY_POOL = new Uint8Array(128_000);
	MEMORY_VIEW = new DataView(MEMORY_POOL.buffer);
	MEMORY_LAYOUT = 0b0000000000000000000000000000000000000000000000000000000000000000;

	MEMORY_LAYOUT |= ((1 << c) - 1) << (64 - c);

	return {
		b: MEMORY_POOL,
		v: MEMORY_VIEW,
		o: 0,
		x: 0,
		i: 0,
		c,
	};
};

const free = (state) => {
	if (MEMORY_VIEW === state.v) {
		MEMORY_LAYOUT &= ~(((1 << state.c) - 1) << (64 - state.c - state.i));
	}
};

const ENCODE_TYPES = [
	(state, _, value) => {
		state.v.setUint8(state.o++, +value);
	},
	(state, _, value) => {
		state.v[`setUint${(state.x - 10) * 8}`](state.o, value);

		state.o += state.x - 10;
	},
	(state, _, value) => {
		state.v[`setInt${(state.x - 20) * 8}`](state.o, value);
		state.o += state.x - 20;
	},
	(state, _, value) => {
		state.v[`setFloat${(state.x - 30) * 8}`](state.o, value);
		state.o += state.x - 30;
	},
	(state, _, value) => {
		const isAscii = state.x < 45;
		const size = state.x - (isAscii ? 40 : 45);

		if (isAscii) {
			state.v[`setUint${size * 8}`](state.o, value.length);

			state.o += size;

			for (let i = 0; i < value.length; ++i) {
				state.v.setUint8(state.o++, value.charCodeAt(i));
			}
		} else {
			const written = encoder.encodeInto(
				value,
				new Uint8Array(state.b.buffer, state.o + size),
			).written;

			state.v[`setUint${size * 8}`](state.o, written);
			state.o += size + written;
		}
	},
	(state, type, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[type.value[i].key]);
		}
	},
	(state, type, value) => {
		state.v[`setUint${(state.x - 60) * 8}`](state.o, value.length);

		state.o += state.x - 60;

		for (let i = 0; i < value.length; ++i) {
			run(state, type.value, value[i]);
		}
	},
	(state, type, value) => {
		state.v.setUint8(state.o++, type.value.indexOf(value));
	},
	(state, type, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[i]);
		}
	},
];

const run = (state, type, value) => {
	state.x = type.type;

	if ((state.x - 100) >> 31 === 0) {
		state.x -= 100;
		state.v.setUint8(state.o++, +(value === null));

		if (value === null) {
			state.v.setUint8(state.o++, 0);

			return;
		}
	}

	type.assert?.(value);

	ENCODE_TYPES[(state.x / 10) | 0](state, type, value);
};

const encode = (type, value, chunks = 1) => {
	try {
		const state = alloc(((chunks * 5 + 3) >> 2) & ~1);

		run(state, type, value);

		const result = state.b.buffer.slice(2 * state.i * 1000, state.o);

		free(state);

		return result;
	} catch (e) {
		EncodeError(e, e?.message);
	}
};

export { encode };
