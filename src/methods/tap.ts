import type { Decoder, Encoder, State } from "../types.js";

export const EncodeTap =
	<const $Type>(
		type: Encoder<$Type>,
		fn: (value: $Type) => any,
	): Encoder<$Type> =>
	(state, value) => {
		fn(value);
		type(state, value);
	};

export const DecodeTap =
	<const $Type>(
		type: Decoder<$Type>,
		fn: (value: $Type) => any,
	): Decoder<$Type> =>
	(state: State) => {
		const value = type(state);
		fn(value);
		return value;
	};
