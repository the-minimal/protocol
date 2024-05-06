import { Name } from "../enums.js";
import type { Type } from "./type.js";

export type NameTypeMap = {
	[Name.Boolean]: Type.Boolean;
	[Name.Int]: Type.Int;
	[Name.Float]: Type.Float;
	[Name.String]: Type.String;
	[Name.Object]: Type.Object;
	[Name.Array]: Type.Array;
	[Name.Enum]: Type.Enum;
	[Name.Tuple]: Type.Tuple;
};

export type NameTypeMapKey = keyof NameTypeMap;

export type NameValueMap = {
	[Name.Boolean]: boolean;
	[Name.Int]: number;
	[Name.Float]: number;
	[Name.String]: string;
	[Name.Object]: Record<string, unknown>;
	[Name.Array]: unknown[];
	[Name.Enum]: string;
	[Name.Tuple]: unknown[];
};

export type NameValueMapKey = keyof NameValueMap;

export type PrimitiveMap = {
	[Name.Boolean]: boolean;
	[Name.Int]: number;
	[Name.Float]: number;
	[Name.String]: string;
};

export type PrimitiveMapKey = keyof PrimitiveMap;
