import { error } from "@the-minimal/error";
import { Kind } from "./enums.js";
import type {
	AnyType,
	Estimate,
	Estimates,
	Settings,
	Type,
} from "./types/index.js";
import { SETTINGS } from "./utils.js";

type MaxLength = {
	maxLength?: number;
};

const STRING = {
	[Kind.Ascii]: 1,
	[Kind.Utf8]: 3,
};

const ARRAY = {
	1: 256,
	2: 65_536,
};

const EstimateError = error("EstimateError");

const TYPES = [
	// Boolean
	(_: Type.Boolean) => 1,
	// Int
	(type: Type.Int) => type.size ?? 1,
	// Float
	(type: Type.Float) => type.size ?? 4,
	// String
	(type: Type.String & MaxLength) =>
		(type.size ?? 1) +
		(type.maxLength ?? ARRAY[type.size ?? 1]) * STRING[type.kind ?? Kind.Ascii],
	// Object
	(type: Type.Object) => type.value.reduce((acc, curr) => acc + run(curr), 0),
	// Array
	(type: Type.Array & MaxLength) =>
		(type.size ?? 1) +
		(type.maxLength ?? ARRAY[type.size ?? 1]) * run(type.value),
	// Enum
	(_: Type.Enum) => 1,
	// Tuple
	(type: Type.Tuple) => type.value.reduce((acc, curr) => acc + run(curr), 0),
] satisfies Estimates;

const run = (type: AnyType): number => (TYPES[type.name] as Estimate)(type);

export const estimate = (type: any, settings: Settings = SETTINGS) => {
	try {
		const bytes = run(type);

		return {
			bytes,
			chunks: Math.ceil(bytes / settings.DEFAULT_CHUNK_SIZE),
		};
	} catch (e) {
		EstimateError(e);
	}
};
