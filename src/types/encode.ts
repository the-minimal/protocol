import type { State } from "./general.js";
import type { AnyProtocolType, Protocol } from "./type.js";

export type Encoders = [
	Encoder<Protocol.Boolean, boolean>,
	Encoder<Protocol.UInt, number>,
	Encoder<Protocol.Int, number>,
	Encoder<Protocol.Float, number>,
	Encoder<Protocol.Ascii, string>,
	Encoder<Protocol.Unicode, string>,
	Encoder<Protocol.Object, Record<string, unknown>>,
	Encoder<Protocol.Array, unknown[]>,
	Encoder<Protocol.Enum, unknown>,
	Encoder<Protocol.Tuple, unknown[]>,
];

export type Encoder<$Type extends AnyProtocolType, $Value> = (
	state: State,
	type: $Type,
	value: $Value,
) => void;
