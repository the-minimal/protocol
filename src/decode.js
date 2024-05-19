import { error } from "@the-minimal/error";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const DECODE_TYPES = [
	(state) => {
		return state.v.getUint8(state.o++) === 1;
	},
	(state) => {
		const result = state.v[`getUint${(state.x - 10) * 8}`](state.o);

		state.o += state.x - 10;

		return result;
	},
	(state) => {
		const result = state.v[`getInt${(state.x - 20) * 8}`](state.o);

		state.o += state.x - 20;

		return result;
	},
	(state) => {
		const result = state.v[`getFloat${(state.x - 30) * 8}`](state.o);

		state.o += state.x - 30;

		return result;
	},
	(state) => {
		const isAscii = state.x < 45;
		const size = state.x - (isAscii ? 40 : 45);
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
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	(state, type) => {
		const length = state.v[`getUint${(state.x - 60) * 8}`](state.o);

		state.o += state.x - 60;

		const result = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(state, type.value);
		}

		return result;
	},
	(state, type) => {
		return type.value[state.v.getUint8(state.o++)];
	},
	(state, type) => {
		const result = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
];

const run = (state, type) => {
	state.x = type.type;

	if (state.x > 99) {
		state.x -= 100;

		if (state.v.getUint8(state.o++) === 1) {
			state.o++;
			return null;
		}
	}

	const result = DECODE_TYPES[(state.x / 10) | 0](state, type);

	type.assert?.(result);

	return result;
};

const decode = (type, b) => {
	try {
		return run(
			{
				b,
				v: new DataView(b),
				x: 0,
				o: 0,
			},
			type,
		);
	} catch (e) {
		DecodeError(e, e?.message);
	}
};

export { decode };
