export const Type = {
	Boolean: 0,
	Int: 1,
	Float: 2,
	String: 3,
	Object: 4,
	Array: 5,
	Enum: 6,
	Tuple: 7,
} as const;

export type TypeValue = (typeof Type)[keyof typeof Type];
export type Type = typeof Type;

export const Kind = {
	Ascii: 0,
	Utf8: 1,
} as const;

export type KindValue = (typeof Kind)[keyof typeof Kind];
export type Kind = typeof Kind;
