import type { AnyProtocolType, Protocol } from "./type.js";

export type Estimates = [
	Estimate<Protocol.Boolean>,
	Estimate<Protocol.UInt>,
	Estimate<Protocol.Int>,
	Estimate<Protocol.Float>,
	Estimate<Protocol.Ascii>,
	Estimate<Protocol.Unicode>,
	Estimate<Protocol.Object>,
	Estimate<Protocol.Array>,
	Estimate<Protocol.Enum>,
	Estimate<Protocol.Tuple>,
];

export type Estimate<$Type extends AnyProtocolType> = (type: $Type) => number;
