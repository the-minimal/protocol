import { UTF8_DECODER, UTF8_ENCODER } from "../constants.js";
import type { Decoder, Encoder } from "../types.js";

const EncodeUnicode = (size: 1 | 2): Encoder<string> => {
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

const DecodeUnicode = (size: 1 | 2): Decoder<string> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		state.o += size;

		const _ = UTF8_DECODER.decode(state.a.subarray(state.o, state.o + length));

		state.o += length;

		return _;
	};
};

export const EncodeUnicode8 = EncodeUnicode(1);
export const EncodeUnicode16 = EncodeUnicode(2);

export const DecodeUnicode8 = DecodeUnicode(1);
export const DecodeUnicode16 = DecodeUnicode(2);
