import type { Decoder, Encoder } from "../types.js";

const encodeFloat = (size: 4 | 8): Encoder<number> => {
	const set = `setFloat${size * 8}` as "setFloat32" | "setFloat64";

	return (state, value) => {
		state.v[set](state.o, value);
		state.o += size;
	};
};

const decodeFloat = (size: 4 | 8): Decoder<number> => {
	const get = `getFloat${size * 8}` as "getFloat32" | "getFloat64";

	return (state) => {
		const result = state.v[get](state.o);
		state.o += size;
		return result;
	};
};

export const encodeFloat32 = encodeFloat(4);
export const encodeFloat64 = encodeFloat(8);

export const decodeFloat32 = decodeFloat(4);
export const decodeFloat64 = decodeFloat(8);
