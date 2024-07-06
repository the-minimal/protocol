import type { Decoder, Encoder } from "../types.js";

export const encodeEnum =
	<const $Type extends any[]>(options: $Type): Encoder<$Type[number]> =>
	(state, value) =>
		(state.a[state.o++] = options.indexOf(value));

export const decodeEnum =
	<const $Type extends any[]>(options: $Type): Decoder<$Type[number]> =>
	(state) =>
		options[state.a[state.o++]];
