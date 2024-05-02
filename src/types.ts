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

	export type Array = Type<{
		type: "array";
		item: Any;
		size?: 8 | 16 | 32;
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

	export type Enum = Type<{
		type: "enum";
		options: string[];
	}>;

	export type Tuple = Type<{
		type: "tuple";
		items: unknown[];
	}>;

	export type Any = Object | Array | Int | Float | Ascii | Enum | Tuple;

	export type TypeNames = Any["type"];
}
