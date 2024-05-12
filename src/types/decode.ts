import type { TypeValue } from "../enums.js";
import type { State } from "./general.js";
import type { NameTypeMap } from "./maps.js";
import type { AnyProtocolType } from "./type.js";

export type Decoders = {
	[$Key in TypeValue]: (state: State, type: NameTypeMap[$Key]) => unknown;
};

export type Decoder = (state: State, type: AnyProtocolType) => unknown;
