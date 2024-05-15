import type { Type } from "../enums.js";

export namespace Protocol {
	export type Assertable = {
		assert?: (v: unknown) => asserts v is unknown;
	};

	export type Keyable = {
		key?: string;
	};

	export type Boolean = New<{
		type: Type.Boolean | Type.NullableBoolean;
	}>;

	export type UInt = New<{
		type:
			| Type.UInt8
			| Type.UInt16
			| Type.UInt32
			| Type.NullableUInt8
			| Type.NullableUInt16
			| Type.NullableUInt32;
	}>;

	export type Int = New<{
		type:
			| Type.Int8
			| Type.Int16
			| Type.Int32
			| Type.NullableInt8
			| Type.NullableInt16
			| Type.NullableInt32;
	}>;

	export type Float = New<{
		type:
			| Type.Float32
			| Type.Float64
			| Type.NullableFloat32
			| Type.NullableFloat64;
	}>;

	export type Ascii = New<{
		type:
			| Type.Ascii8
			| Type.Ascii16
			| Type.NullableAscii8
			| Type.NullableAscii16;
	}>;

	export type Unicode = New<{
		type:
			| Type.Unicode8
			| Type.Unicode16
			| Type.NullableUnicode8
			| Type.NullableUnicode16;
	}>;

	export type Object = New<{
		type: Type.Object | Type.NullableObject;
		value: readonly (AnyProtocolType & Required<Keyable>)[];
	}>;

	export type Array = New<{
		type:
			| Type.Array8
			| Type.Array16
			| Type.NullableArray8
			| Type.NullableArray16;
		value: AnyProtocolType;
	}>;

	export type Enum = New<{
		type: Type.Enum | Type.NullableEnum;
		value: readonly unknown[];
	}>;

	export type Tuple = New<{
		type: Type.Tuple | Type.NullableTuple;
		value: readonly AnyProtocolType[];
	}>;
}

export type AnyProtocolType =
	| Protocol.Boolean
	| Protocol.UInt
	| Protocol.Int
	| Protocol.Float
	| Protocol.Ascii
	| Protocol.Unicode
	| Protocol.Object
	| Protocol.Array
	| Protocol.Enum
	| Protocol.Tuple;

type New<$ProtocolType extends AnyProtocolType> = $ProtocolType &
	Protocol.Assertable &
	Protocol.Keyable;
