import type { Decoder, Encoder } from "../types.js";

export const EncodeNullable =
	<const $Type>(type: Encoder<$Type>): Encoder<$Type | null> =>
	(state, value) =>
		value === null
			? (state.a[state.o++] = 1)
			: ((state.a[state.o++] = 0), type(state, value));

export const DecodeNullable =
	<const $Type>(type: Decoder<$Type>): Decoder<$Type | null> =>
	(state) =>
		state.a[state.o++] === 1 ? null : type(state);
