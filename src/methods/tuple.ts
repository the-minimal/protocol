import type {
	Decoder,
	Encoder,
	InferDecodeTuple,
	InferEncodeTuple,
} from "../types.js";

export const EncodeTuple = <const $Type extends Encoder<any>[]>(
	types: $Type,
): Encoder<InferEncodeTuple<$Type>> => {
	const length = types.length;

	return (state, value) => {
		for (let i = 0; i < length; ++i) {
			types[i](state, value[i]);
		}
	};
};

export const DecodeTuple = <const $Type extends Decoder<any>[]>(
	types: $Type,
): Decoder<InferDecodeTuple<$Type>> => {
	const length = types.length;

	return (state) => {
		const _: any = new Array(length);

		for (let i = 0; i < length; ++i) {
			_[i] = types[i](state);
		}

		return _;
	};
};
