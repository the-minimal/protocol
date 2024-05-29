import type { Decoder, Encoder } from "../types.js";

const EncodeInteger = (size: 1 | 2 | 4, signed = false): Encoder<number> => {
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

const DecodeInteger = (size: 1 | 2 | 4, signed = false): Decoder<number> => {
	const get = `get${signed ? "Int" : "Uint"}${size * 8}` as
		| "getInt8"
		| "getUint8"
		| "getInt16"
		| "getUint16"
		| "getInt32"
		| "getUint32";

	return (state) => {
		const _ = state.v[get](state.o);
		state.o += size;
		return _;
	};
};

export const EncodeUint8 = EncodeInteger(1, false);
export const EncodeUint16 = EncodeInteger(2, false);
export const EncodeUint32 = EncodeInteger(4, false);
export const EncodeInt8 = EncodeInteger(1, true);
export const EncodeInt16 = EncodeInteger(2, true);
export const EncodeInt32 = EncodeInteger(4, true);

export const DecodeUint8 = DecodeInteger(1, false);
export const DecodeUint16 = DecodeInteger(2, false);
export const DecodeUint32 = DecodeInteger(4, false);
export const DecodeInt8 = DecodeInteger(1, true);
export const DecodeInt16 = DecodeInteger(2, true);
export const DecodeInt32 = DecodeInteger(4, true);
