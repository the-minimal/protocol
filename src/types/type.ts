import type { Kind, Name } from "../enums.js";

export namespace Type {
	export type Nullable = {
		nullable?: boolean;
	};

	export type Assertable = {
		assert?: (v: unknown) => asserts v is unknown;
	};

	export type Keyable = {
		key?: string;
	};

	export type Boolean = New<{
		name: Name.Boolean;
	}>;

	export type Int = New<{
		name: Name.Int;
		signed?: boolean;
		size?: 1 | 2 | 4;
	}>;

	export type Float = New<{
		name: Name.Float;
		size?: 4 | 8;
	}>;

	export type String = New<{
		name: Name.String;
		kind?: Kind;
		size?: 1 | 2;
	}>;

	export type Object = New<{
		name: Name.Object;
		value: readonly (AnyType & Required<Keyable>)[];
	}>;

	export type Array = New<{
		name: Name.Array;
		value: AnyType;
		size?: 1 | 2;
	}>;

	export type Enum = New<{
		name: Name.Enum;
		value: readonly string[];
	}>;

	export type Tuple = New<{
		name: Name.Tuple;
		value: readonly AnyType[];
	}>;
}

export type AnyType =
	| Type.Boolean
	| Type.Int
	| Type.Float
	| Type.String
	| Type.Object
	| Type.Array
	| Type.Enum
	| Type.Tuple;

type New<$Type extends AnyType> = $Type &
	Type.Nullable &
	Type.Assertable &
	Type.Keyable;
