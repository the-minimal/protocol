import type { KindValue, Type } from "../enums.js";

export namespace Protocol {
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
		type: Type["Boolean"];
	}>;

	export type Int = New<{
		type: Type["Int"];
		signed?: boolean;
		size?: 1 | 2 | 4;
	}>;

	export type Float = New<{
		type: Type["Float"];
		size?: 4 | 8;
	}>;

	export type String = New<{
		type: Type["String"];
		kind?: KindValue;
		size?: 1 | 2;
	}>;

	export type Object = New<{
		type: Type["Object"];
		value: readonly (AnyProtocolType & Required<Keyable>)[];
	}>;

	export type Array = New<{
		type: Type["Array"];
		value: AnyProtocolType;
		size?: 1 | 2;
	}>;

	export type Enum = New<{
		type: Type["Enum"];
		value: readonly string[];
	}>;

	export type Tuple = New<{
		type: Type["Tuple"];
		value: readonly AnyProtocolType[];
	}>;
}

export type AnyProtocolType =
	| Protocol.Boolean
	| Protocol.Int
	| Protocol.Float
	| Protocol.String
	| Protocol.Object
	| Protocol.Array
	| Protocol.Enum
	| Protocol.Tuple;

type New<$ProtocolType extends AnyProtocolType> = $ProtocolType &
	Protocol.Nullable &
	Protocol.Assertable &
	Protocol.Keyable;
