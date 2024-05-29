import { ASCII_DECODER } from "../constants.js";
import type { Decoder, Encoder } from "../types.js";

const EncodeAscii = (size: 1 | 2): Encoder<string> => {
	const set = size === 1 ? "setUint8" : "setUint16";

	return (state, value) => {
		state.v[set](state.o, value.length);

		state.o += size;

		for (let i = 0; i < value.length; ++i) {
			state.a[state.o++] = value.charCodeAt(i);
		}
	};
};

const DecodeAscii = (size: 1 | 2): Decoder<string> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		state.o += size;

		const _ = ASCII_DECODER.decode(state.a.subarray(state.o, state.o + length));

		state.o += length;

		return _;
	};
};

export const EncodeAscii8 = EncodeAscii(1);
export const EncodeAscii16 = EncodeAscii(2);

export const DecodeAscii8 = DecodeAscii(1);
export const DecodeAscii16 = DecodeAscii(2);
