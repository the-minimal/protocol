import type { Decoder, Encoder } from "../types.js";

export const encodeNullable =
	<const $Type>(type: Encoder<$Type>): Encoder<$Type | null> =>
	(state, value) =>
		value === null
			? (state.a[state.o++] = 1)
			: ((state.a[state.o++] = 0), type(state, value));

export const decodeNullable =
	<const $Type>(type: Decoder<$Type>): Decoder<$Type | null> =>
	(state) =>
		state.a[state.o++] === 1 ? null : type(state);
