import type { Name } from "../enums.js";
import type { State } from "./general.js";
import type { NameTypeMap, NameValueMap } from "./maps.js";
import type { AnyType } from "./type.js";

export type Encoders = {
	[$Key in Name]: (
		state: State,
		type: NameTypeMap[$Key],
		value: NameValueMap[$Key],
	) => void;
};

export type Encoder = (state: State, type: AnyType, value: unknown) => void;
