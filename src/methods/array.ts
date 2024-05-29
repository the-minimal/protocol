import type { Decoder, Encoder } from "../types.js";

const EncodeArray = <const $Type>(
	size: 1 | 2,
	type: Encoder<$Type>,
): Encoder<$Type[]> => {
	const set = size === 1 ? "setUint8" : "setUint16";

	return (state, value) => {
		state.v[set](state.o, value.length);

		state.o += size;

		for (let i = 0; i < value.length; i++) {
			type(state, value[i]);
		}
	};
};

const DecodeArray = <const $Type>(
	size: 1 | 2,
	type: Decoder<$Type>,
): Decoder<$Type[]> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		const _: any = new Array(length);

		state.o += size;

		for (let i = 0; i < length; ++i) {
			_[i] = type(state);
		}

		return _;
	};
};

export const EncodeArray8 = (type: any) => EncodeArray(1, type);
export const EncodeArray16 = (type: any) => EncodeArray(2, type);

export const DecodeArray8 = (type: any) => DecodeArray(1, type);
export const DecodeArray16 = (type: any) => DecodeArray(2, type);
