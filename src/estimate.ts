import type { Settings, Type } from "./types";
import { SETTINGS } from "./utils";

type MaxLength = {
	maxLength?: number;
};

const STRING = {
	ascii: 1,
	utf8: 3,
};

const ARRAY = {
	8: 256,
	16: 65_536,
};

const TYPES = {
	boolean: (_: Type.Boolean) => 1,
	int: (type: Type.Int) => (type.size ?? 8) / 8,
	float: (type: Type.Float) => (type.size ?? 32) / 8,
	string: (type: Type.String & MaxLength) =>
		(type.size ?? 8) / 8 +
		(type.maxLength ?? ARRAY[type.size ?? 8]) * STRING[type.kind ?? "ascii"],
	object: (type: Type.Object) =>
		type.value.reduce((acc, curr) => acc + run(curr), 0),
	array: (type: Type.Array & MaxLength) =>
		(type.size ?? 8) / 8 +
		(type.maxLength ?? ARRAY[type.size ?? 8]) * run(type.value),
	enum: (_: Type.Enum) => 1,
	tuple: (type: Type.Tuple) =>
		type.value.reduce((acc, curr) => acc + run(curr), 0),
};

const run = (type: Type.Any) => (TYPES as any)[type.type](type) as number;

export const estimate = (type: Type.Any, settings: Settings = SETTINGS) => {
	const bytes = run(type);

	return {
		bytes,
		chunks: Math.ceil(bytes / settings.DEFAULT_CHUNK_SIZE),
	};
};
