import type { TypeValue } from "../enums.js";
import type { State } from "./general.js";
import type { NameTypeMap, NameValueMap } from "./maps.js";
import type { AnyProtocolType } from "./type.js";

export type Encoders = {
	[$Key in TypeValue]: (
		state: State,
		type: NameTypeMap[$Key],
		value: NameValueMap[$Key],
	) => void;
};

export type Encoder = (
	state: State,
	type: AnyProtocolType,
	value: unknown,
) => void;
