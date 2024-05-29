import type { Decoder, Encoder } from "../types.js";

const EncodeFloat = (size: 4 | 8): Encoder<number> => {
	const set = `setFloat${size * 8}` as "setFloat32" | "setFloat64";

	return (state, value) => {
		state.v[set](state.o, value);
		state.o += size;
	};
};

const DecodeFloat = (size: 4 | 8): Decoder<number> => {
	const get = `getFloat${size * 8}` as "getFloat32" | "getFloat64";

	return (state) => {
		const _ = state.v[get](state.o);
		state.o += size;
		return _;
	};
};

export const EncodeFloat32 = EncodeFloat(4);
export const EncodeFloat64 = EncodeFloat(8);

export const DecodeFloat32 = DecodeFloat(4);
export const DecodeFloat64 = DecodeFloat(8);
