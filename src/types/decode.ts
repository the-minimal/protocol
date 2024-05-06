import type { Name } from "../enums.js";
import type { State } from "./general.js";
import type { NameTypeMap } from "./maps.js";
import type { AnyType } from "./type.js";

export type Decoders = {
	[$Key in Name]: (state: State, type: NameTypeMap[$Key]) => unknown;
};

export type Decoder = (state: State, type: AnyType) => unknown;
