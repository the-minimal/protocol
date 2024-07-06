import { UTF8_DECODER, UTF8_ENCODER } from "../constants.js";
import type { Decoder, Encoder } from "../types.js";

const encodeUnicode = (size: 1 | 2): Encoder<string> => {
	const set = size === 1 ? "setUint8" : "setUint16";

	return (state, value) => {
		const written = UTF8_ENCODER.encodeInto(
			value,
			state.a.subarray(state.o + size),
		).written;

		state.v[set](state.o, written);

		state.o += size + written;
	};
};

const decodeUnicode = (size: 1 | 2): Decoder<string> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		state.o += size;

		const result = UTF8_DECODER.decode(
			state.a.subarray(state.o, state.o + length),
		);

		state.o += length;

		return result;
	};
};

export const encodeUnicode8 = encodeUnicode(1);
export const encodeUnicode16 = encodeUnicode(2);

export const decodeUnicode8 = decodeUnicode(1);
export const decodeUnicode16 = decodeUnicode(2);
