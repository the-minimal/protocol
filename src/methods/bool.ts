import type { Decoder, Encoder } from "../types.js";

export const encodeBool: Encoder<boolean> = (state, value) =>
	(state.a[state.o++] = +value);

export const decodeBool: Decoder<boolean> = (state) => !!state.a[state.o++];
