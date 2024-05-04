export namespace Type {
	type Nullable = {
		nullable?: boolean;
	};

	type Assertable = {
		assert?: (v: unknown) => asserts v is unknown;
	};

	type Keyable = {
		key?: string;
	};

	type New<$Type extends Any> = $Type & Nullable & Assertable & Keyable;

	export type Any = { type: string } & Nullable &
		Assertable &
		Keyable &
		Record<string, unknown>;

	export type Object = New<{
		type: "object";
		properties: (Any & Required<Keyable>)[];
	}>;

	export type Array = New<{
		type: "array";
		item: Any;
		size?: 8 | 16 | 32;
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
		kind?: "ascii" | "utf8" | "utf16";
		size?: 8 | 16;
	}>;

	export type Enum = New<{
		type: "enum";
		options: string[];
	}>;

	export type Tuple = New<{
		type: "tuple";
		items: Any[];
	}>;
}

export type State = {
	offset: number;
	buffer: ArrayBuffer;
	view: DataView;
	index: number;
	chunks: number;
};

export type Position = {
	offset: number;
};

export type Settings = Partial<{
	DEFAULT_SIZE: number;
	MAX_SIZE: number;
	MAX_BUFFERS: number;
}>;
