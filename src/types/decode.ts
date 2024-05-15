import type { AnyProtocolType, Protocol } from "./type.js";

export type DecodeState = {
	buffer: ArrayBufferLike;
	view: DataView;
	offset: number;
};

export type Decoders = [
	Decoder<Protocol.Boolean, boolean>,
	Decoder<Protocol.UInt, number>,
	Decoder<Protocol.Int, number>,
	Decoder<Protocol.Float, number>,
	Decoder<Protocol.Ascii, string>,
	Decoder<Protocol.Unicode, string>,
	Decoder<Protocol.Object, Record<string, unknown>>,
	Decoder<Protocol.Array, unknown[]>,
	Decoder<Protocol.Enum, unknown>,
	Decoder<Protocol.Tuple, unknown[]>,
];

export type Decoder<$Type extends AnyProtocolType, $Value> = (
	state: DecodeState,
	type: $Type,
	index: number,
) => $Value;
