import { error } from "@the-minimal/error";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const DECODE_TYPES = [
	(state) => {
		return state.v.getUint8(state.o) === 1;
	},
	(state, _, index) => {
		const result = state.v[`getUint${(index - 10) * 8}`](state.o);

		state.o += index - 10;

		return result;
	},
	(state, _, index) => {
		const result = state.v[`getInt${(index - 20) * 8}`](state.o);

		state.o += index - 20;

		return result;
	},
	(state, _, index) => {
		const result = state.v[`getFloat${(index - 30) * 8}`](state.o);

		state.o += index - 30;

		return result;
	},
	(state, _, index) => {
		const isAscii = index < 45;
		const size = index - (isAscii ? 40 : 45);
		const length = state.v[`getUint${size * 8}`](state.o);

		state.o += size;

		const result = (isAscii ? ascii : utf8).decode(
			new Uint8Array(state.b, state.o, length),
		);

		state.o += length;

		return result;
	},
	(state, type) => {
		const result = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = runDecode(state, type.value[i]);
		}

		return result;
	},
	(state, type, index) => {
		const length = state.v[`getUint${(index - 60) * 8}`](state.o);

		state.o += index - 60;

		const result = [];

		for (let i = 0; i < length; ++i) {
			result[i] = runDecode(state, type.value);
		}

		return result;
	},
	(state, type) => {
		return type.value[state.v.getUint8(state.o++)];
	},
	(state, type) => {
		const result = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = runDecode(state, type.value[i]);
		}

		return result;
	},
];

const runDecode = (state, type) => {
	let index = type.type;

	if (index > 99) {
		index -= 100;

		if (state.v.getUint8(state.o++) === 1) {
			state.o++;
			return null;
		}
	}

	const result = DECODE_TYPES[(index / 10) | 0](state, type, index);

	type.assert?.(result);

	return result;
};

const decode = (type, buffer) => {
	try {
		return runDecode(
			{
				b: buffer,
				v: new DataView(buffer),
				o: 0,
			},
			type,
		);
	} catch (e) {
		DecodeError(e, e?.message);
	}
};

export { decode };
