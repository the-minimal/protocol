import type { Decoder, Encoder } from "../types.js";

const encodeArray = <const $Type>(
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

const decodeArray = <const $Type>(
	size: 1 | 2,
	type: Decoder<$Type>,
): Decoder<$Type[]> => {
	const get = size === 1 ? "getUint8" : "getUint16";

	return (state) => {
		const length = state.v[get](state.o);

		const result: any = new Array(length);

		state.o += size;

		for (let i = 0; i < length; ++i) {
			result[i] = type(state);
		}

		return result;
	};
};

export const encodeArray8 = (type: any) => encodeArray(1, type);
export const encodeArray16 = (type: any) => encodeArray(2, type);

export const decodeArray8 = (type: any) => decodeArray(1, type);
export const decodeArray16 = (type: any) => decodeArray(2, type);
