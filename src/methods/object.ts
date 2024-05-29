import type {
	DecodeObjectSchema,
	Decoder,
	EncodeObjectSchema,
	Encoder,
	InferDecodeObject,
	InferEncodeObject,
} from "../types.js";

export const EncodeObject = <const $Type extends EncodeObjectSchema>(
	schema: $Type,
): Encoder<InferEncodeObject<$Type>> => {
	const length = schema.length;

	return (state, value) => {
		for (let i = 0; i < length; ++i) {
			schema[i].type(state, (value as any)[schema[i].key]);
		}
	};
};

export const DecodeObject = <const $Type extends DecodeObjectSchema>(
	schema: $Type,
): Decoder<InferDecodeObject<$Type>> => {
	const length = schema.length;

	return (state) => {
		const _: any = {};

		for (let i = 0; i < length; ++i) {
			_[schema[i].key] = schema[i].type(state);
		}

		return _;
	};
};
