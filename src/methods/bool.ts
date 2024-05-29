import type { Decoder, Encoder } from "../types.js";

export const EncodeBool: Encoder<boolean> = (state, value) =>
	(state.a[state.o++] = +value);
export const DecodeBool: Decoder<boolean> = (state) => !!state.a[state.o++];
