import type { Decoder, Encoder } from "../types.js";

const encodeInteger = (size: 1 | 2 | 4, signed = false): Encoder<number> => {
	const set = `set${signed ? "Int" : "Uint"}${size * 8}` as
		| "setInt8"
		| "setUint8"
		| "setInt16"
		| "setUint16"
		| "setInt32"
		| "setUint32";

	return (state, value) => {
		state.v[set](state.o, value);
		state.o += size;
	};
};

const decodeInteger = (size: 1 | 2 | 4, signed = false): Decoder<number> => {
	const get = `get${signed ? "Int" : "Uint"}${size * 8}` as
		| "getInt8"
		| "getUint8"
		| "getInt16"
		| "getUint16"
		| "getInt32"
		| "getUint32";

	return (state) => {
		const result = state.v[get](state.o);
		state.o += size;
		return result;
	};
};

export const encodeUint8 = encodeInteger(1, false);
export const encodeUint16 = encodeInteger(2, false);
export const encodeUint32 = encodeInteger(4, false);
export const encodeInt8 = encodeInteger(1, true);
export const encodeInt16 = encodeInteger(2, true);
export const encodeInt32 = encodeInteger(4, true);

export const decodeUint8 = decodeInteger(1, false);
export const decodeUint16 = decodeInteger(2, false);
export const decodeUint32 = decodeInteger(4, false);
export const decodeInt8 = decodeInteger(1, true);
export const decodeInt16 = decodeInteger(2, true);
export const decodeInt32 = decodeInteger(4, true);
