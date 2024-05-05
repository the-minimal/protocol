type New<$Type extends Type.Any> = $Type & Type.Nullable & Type.Assertable & Type.Keyable;

export enum Name {
	Boolean,
	Int,
	Float,
	String,
	Object,
	Array,
	Enum,
	Tuple
}

export enum Kind {
	Ascii,
	Utf8
}

export type NameTypeMap = {
	[Name.Boolean]: Type.Boolean;
	[Name.Int]: Type.Int;
	[Name.Float]: Type.Float;
	[Name.String]: Type.String;
	[Name.Object]: Type.Object;
	[Name.Array]: Type.Array;
	[Name.Enum]: Type.Enum;
	[Name.Tuple]: Type.Tuple;
};

export type NameValueMap = {
	[Name.Boolean]: boolean;
	[Name.Int]: number;
	[Name.Float]: number;
	[Name.String]: string;
	[Name.Object]: Record<string, unknown>;
	[Name.Array]: unknown[];
	[Name.Enum]: string;
	[Name.Tuple]: unknown[];
};

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
		value: readonly (Any & Required<Keyable>)[];
	}>;

	export type Array = New<{
		name: Name.Array;
		value: Any;
		size?: 1 | 2;
	}>;

	export type Enum = New<{
		name: Name.Enum;
		value: readonly string[];
	}>;

	export type Tuple = New<{
		name: Name.Tuple;
		value: readonly Any[];
	}>;

	export type Any = 
		| Boolean
		| Int
		| Float
		| String
		| Object
		| Array
		| Enum
		| Tuple;
}

type Primitive = {
	[Name.Boolean]: boolean;
	[Name.Int]: number;
	[Name.Float]: number;
	[Name.String]: string;
};

type PrimitiveKey = Name.Boolean | Name.Int | Name.Float | Name.String;

type InferTuple<$Tuple extends readonly unknown[]> = $Tuple extends readonly Type.Any[]
	? $Tuple extends readonly [infer $Head, ...infer $Tail] 
		? [Infer<$Head>, ...InferTuple<$Tail>]
		: []
	: [];

type Nullable<$Boolean extends boolean, $Type> = $Boolean extends true 
	? $Type | null
	: $Type;

type InferName<$Type> = $Type extends Type.Any ? $Type["name"]: never;

type InferNullable<$Type> = $Type extends Required<Type.Nullable >
	? $Type["nullable"]
	: false;

type InferObject<$Type extends Type.Object> = {
	[$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
};

export type Infer<
	$Type, 
	$Name extends Name = InferName<$Type>,
	$Nullable extends boolean = InferNullable<$Type>
> = $Type extends Type.Any
	? $Name extends PrimitiveKey
		? Nullable<$Nullable, Primitive[$Name]> 
		: $Type extends Type.Object
			? Nullable<$Nullable, InferObject<$Type>>
			: $Type extends Type.Array
				? Nullable<$Nullable, Infer<$Type["value"]>[]>
				: $Type extends Type.Enum
					? Nullable<$Nullable, $Type["value"][number]>
					: $Type extends Type.Tuple
						? Nullable<$Nullable, InferTuple<$Type["value"]>>
						: Nullable<$Nullable, unknown>
	: never;

export type State = {
	offset: number;
	buffer: ArrayBuffer;
	view: DataView;
	index: number;
	chunks: number;
};

export type Settings = {
	DEFAULT_POOL_SIZE: number;
	MAX_POOL_SIZE: number;
	DEFAULT_CHUNK_SIZE: number;
};

export type Encoders = {
	[$Key in Name]: (
		state: State, 
		type: NameTypeMap[$Key], 
		value: NameValueMap[$Key]
	) => void;
};

export type Encoder = (state: State, type: Type.Any, value: unknown) => void;

export type Decoders = {
	[$Key in Name]: (
		state: State, 
		type: NameTypeMap[$Key]
	) => unknown;
};

export type Decoder = (state: State, type: Type.Any) => unknown;

export type Estimates = {
	[$Key in Name]: (type: NameTypeMap[$Key]) => number;
};

export type Estimate = (type: Type.Any) => number
