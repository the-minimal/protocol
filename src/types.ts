type New<$Type extends Type.Any> = $Type & Type.Nullable & Type.Assertable & Type.Keyable;

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

	export type Any = New<{ type: string }> & Record<string, unknown>;

	export type Object = New<{
		type: "object";
		value: (Any & Required<Keyable>)[];
	}>;

	export type Array = New<{
		type: "array";
		value: Any;
		size?: 8 | 16;
	}>;

	export type Boolean = New<{
		type: "boolean";
	}>;

	export type Int = New<{
		type: "int";
		signed?: boolean;
		size?: 8 | 16 | 32;
	}>;

	export type Float = New<{
		type: "float";
		size?: 32 | 64;
	}>;

	export type String = New<{
		type: "string";
		kind?: "ascii" | "utf8";
		size?: 8 | 16;
	}>;

	export type Enum = New<{
		type: "enum";
		value: string[];
	}>;

	export type Tuple = New<{
		type: "tuple";
		value: Any[];
	}>;
}

type Primitive = {
	int: number;
	float: number;
	boolean: boolean;
	string: string;
};

type PrimitiveKey = keyof Primitive;

type InferTuple<$Tuple extends unknown[]> = $Tuple extends Type.Any[]
	? $Tuple extends [infer $Head, ...infer $Tail] 
		? [Infer<$Head>, ...InferTuple<$Tail>]
		: []
	: [];

type Nullable<$Boolean extends boolean, $Type> = $Boolean extends true 
	? $Type | null
	: $Type;

type InferName<$Type> = $Type extends Type.Any ? $Type["type"]: never;

type InferNullable<$Type> = $Type extends Required<Type.Nullable >
	? $Type["nullable"]
	: false;

type InferObject<$Type extends Type.Object> = {
	[$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
};

export type Infer<
	$Type, 
	$Name extends string = InferName<$Type>,
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
