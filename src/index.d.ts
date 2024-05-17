declare namespace Type {
	type Bool = 0;
	type NBool = 100;
	type UInt8 = 11;
	type UInt16 = 12;
	type UInt32 = 14;
	type NUInt8 = 111;
	type NUInt16 = 112;
	type NUInt32 = 114;
	type Int8 = 21;
	type Int16 = 22;
	type Int32 = 24;
	type NInt8 = 121;
	type NInt16 = 122;
	type NInt32 = 124;
	type Float32 = 34;
	type Float64 = 38;
	type NFloat32 = 134;
	type NFloat64 = 138;
	type Ascii8 = 41;
	type Ascii16 = 42;
	type NAscii8 = 141;
	type NAscii16 = 142;
	type Unicode8 = 46;
	type Unicode16 = 47;
	type NUnicode8 = 46;
	type NUnicode16 = 147;
	type Struct = 50;
	type NStruct = 150;
	type Array8 = 61;
	type Array16 = 62;
	type NArray8 = 161;
	type NArray16 = 162;
	type Enum = 70;
	type NEnum = 170;
	type Tuple = 80;
	type NTuple = 180;
}

declare namespace Protocol {
	type Assertable = {
		assert?: (v: unknown) => undefined | unknown;
	};

	type Keyable = {
		key?: string;
	};

	type Bool = {
		type: Type.Bool | Type.NBool;
	} & Assertable &
		Keyable;

	type UInt = {
		type:
			| Type.UInt8
			| Type.UInt16
			| Type.UInt32
			| Type.NUInt8
			| Type.NUInt16
			| Type.NUInt32;
	} & Assertable &
		Keyable;

	type Int = {
		type:
			| Type.Int8
			| Type.Int16
			| Type.Int32
			| Type.NInt8
			| Type.NInt16
			| Type.NInt32;
	} & Assertable &
		Keyable;

	type Float = {
		type: Type.Float32 | Type.Float64 | Type.NFloat32 | Type.NFloat64;
	} & Assertable &
		Keyable;

	type Ascii = {
		type: Type.Ascii8 | Type.Ascii16 | Type.NAscii8 | Type.NAscii16;
	} & Assertable &
		Keyable;

	type Unicode = {
		type: Type.Unicode8 | Type.Unicode16 | Type.NUnicode8 | Type.NUnicode16;
	} & Assertable &
		Keyable;

	type Struct = {
		type: Type.Struct | Type.NStruct;
		value: readonly (Any & Required<Keyable>)[];
	} & Assertable &
		Keyable;

	type Array = {
		type: Type.Array8 | Type.Array16 | Type.NArray8 | Type.NArray16;
		value: Any;
	} & Assertable &
		Keyable;

	type Enum = {
		type: Type.Enum | Type.NEnum;
		value: readonly unknown[];
	} & Assertable &
		Keyable;

	type Tuple = {
		type: Type.Tuple | Type.NTuple;
		value: readonly Any[];
	} & Assertable &
		Keyable;

	type Any =
		| Protocol.Bool
		| Protocol.UInt
		| Protocol.Int
		| Protocol.Float
		| Protocol.Ascii
		| Protocol.Unicode
		| Protocol.Struct
		| Protocol.Array
		| Protocol.Enum
		| Protocol.Tuple;

	type Primitive =
		| Protocol.Bool
		| Protocol.UInt
		| Protocol.Int
		| Protocol.Float
		| Protocol.Ascii
		| Protocol.Unicode;
}

type PrimitiveInputMap = {
	0: boolean;
	100: boolean | null;
	11: number;
	12: number;
	14: number;
	21: number;
	22: number;
	24: number;
	34: number;
	38: number;
	111: number | null;
	112: number | null;
	114: number | null;
	121: number | null;
	122: number | null;
	124: number | null;
	134: number | null;
	138: number | null;
	41: string;
	42: string;
	46: string;
	47: string;
	141: string | null;
	142: string | null;
	146: string | null;
	147: string | null;
};

type InferTupleValue<$Tuple extends readonly unknown[]> =
	$Tuple extends readonly Protocol.Any[]
		? $Tuple extends readonly [infer $Head, ...infer $Tail]
			? [Infer<$Head>, ...InferTupleValue<$Tail>]
			: []
		: [];

type InferTuple<$Type extends Protocol.Tuple> = $Type["type"] extends 80
	? InferTupleValue<$Type["value"]>
	: InferTupleValue<$Type["value"]> | null;

type InferStruct<$Type extends Protocol.Struct> = $Type["type"] extends 50
	? {
			[$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
		}
	:
			| {
					[$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
			  }
			| null;

type InferArray<$Type extends Protocol.Array> = $Type["type"] extends 61 | 62
	? Infer<$Type["value"]>[]
	: Infer<$Type["value"]>[] | null;

type InferEnum<$Type extends Protocol.Enum> = $Type["type"] extends 70
	? $Type["value"]
	: $Type["value"] | null;

type Infer<$Type> = $Type extends Protocol.Any
	? $Type extends Protocol.Primitive
		? PrimitiveInputMap[$Type["type"]]
		: $Type extends Protocol.Struct
			? InferStruct<$Type>
			: $Type extends Protocol.Array
				? InferArray<$Type>
				: $Type extends Protocol.Enum
					? InferEnum<$Type>
					: $Type extends Protocol.Tuple
						? InferTuple<$Type>
						: unknown
	: never;

export type { Type, Protocol, Infer };
