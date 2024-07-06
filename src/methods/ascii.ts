import { ASCII_DECODER } from "../constants.js";
import type { Decoder, Encoder } from "../types.js";

const encodeAscii = (size: 1 | 2): Encoder<string> => {
	const set = size === 1 ? "setUint8" : "setUint16";

	return (state, value) => {
		state.v[set](state.o, value.length);

		state.o += size;

		for (let i = 0; i < value.length; ++i) {
			state.a[state.o++] = value.charCodeAt(i);
		}
	};
};

const decodeAscii = (size: 1 | 2): Decoder<string> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		state.o += size;

		const result = ASCII_DECODER.decode(
			state.a.subarray(state.o, state.o + length),
		);

		state.o += length;

		return result;
	};
};

export const encodeAscii8 = encodeAscii(1);
export const encodeAscii16 = encodeAscii(2);

export const decodeAscii8 = decodeAscii(1);
export const decodeAscii16 = decodeAscii(2);
