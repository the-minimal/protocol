import type { NameValue } from "../enums.js";
import type { NameTypeMap } from "./maps.js";
import type { AnyType } from "./type.js";

export type Estimates = {
	[$Key in NameValue]: (type: NameTypeMap[$Key]) => number;
};

export type Estimate = (type: AnyType) => number;
