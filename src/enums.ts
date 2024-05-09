export const Name = {
	Boolean: 0,
	Int: 1,
	Float: 2,
	String: 3,
	Object: 4,
	Array: 5,
	Enum: 6,
	Tuple: 7,
} as const;

export type NameValue = (typeof Name)[keyof typeof Name];
export type Name = typeof Name;

export const Kind = {
	Ascii: 0,
	Utf8: 1,
} as const;

export type KindValue = (typeof Kind)[keyof typeof Kind];
export type Kind = typeof Kind;
