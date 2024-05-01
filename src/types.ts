export namespace Protocol {
	type Nullable = {
		nullable?: boolean;
	};

	type Assertable = {
		parse?: (v: unknown) => unknown;
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

	export type Ascii = Type<{
		type: "ascii";
		size?: 8 | 16;
	}>;

	export type Any = Object | Int | Ascii;

	export type TypeNames = Any["type"];

	export type Decoders = {
		[$TypeName in TypeNames]: (schema: any, view: DataView) => any;
	};

	export type Encoders = {
		[$TypeName in TypeNames]: (schema: any, value: any) => void;
	};
}
