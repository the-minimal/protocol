import { Type } from "../enums.js";
import type { Protocol } from "./type.js";

export type NameTypeMap = {
	[Type.Boolean]: Protocol.Boolean;
	[Type.Int]: Protocol.Int;
	[Type.Float]: Protocol.Float;
	[Type.String]: Protocol.String;
	[Type.Object]: Protocol.Object;
	[Type.Array]: Protocol.Array;
	[Type.Enum]: Protocol.Enum;
	[Type.Tuple]: Protocol.Tuple;
};

export type NameTypeMapKey = keyof NameTypeMap;

export type NameValueMap = {
	[Type.Boolean]: boolean;
	[Type.Int]: number;
	[Type.Float]: number;
	[Type.String]: string;
	[Type.Object]: Record<string, unknown>;
	[Type.Array]: unknown[];
	[Type.Enum]: string;
	[Type.Tuple]: unknown[];
};

export type NameValueMapKey = keyof NameValueMap;

export type PrimitiveMap = {
	[Type.Boolean]: boolean;
	[Type.Int]: number;
	[Type.Float]: number;
	[Type.String]: string;
};

export type PrimitiveMapKey = keyof PrimitiveMap;
