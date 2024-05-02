export namespace Protocol {
	type Nullable = {
		nullable?: boolean;
	};

	type Assertable = {
		assert?: (v: unknown) => asserts v is unknown;
	};

	type Keyable = {
		key?: string;
	};

	type Type<$Type extends Any> = $Type & Nullable & Assertable & Keyable;

	export type Object = Type<{
		type: "object";
		properties: (Any & Required<Keyable>)[];
	}>;

	export type Int = Type<{
		type: "int";
		unsigned?: boolean;
		size?: 8 | 16 | 32;
	}>;

	export type Float = Type<{
		type: "float";
		size?: 32 | 64;
	}>;

	export type Ascii = Type<{
		type: "ascii";
		size?: 8 | 16;
	}>;

	export type Any = Object | Int | Float | Ascii;

	export type TypeNames = Any["type"];
}
