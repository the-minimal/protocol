import type { TypeValue } from "../enums.js";
import type { NameTypeMap } from "./maps.js";
import type { AnyProtocolType } from "./type.js";

export type Estimates = {
	[$Key in TypeValue]: (type: NameTypeMap[$Key]) => number;
};

export type Estimate = (type: AnyProtocolType) => number;
