export type State = {
	// offset
	o: number;
	// array
	a: Uint8Array;
	// view
	v: DataView;
};

export type Encoder<$Type> = (state: State, value: $Type) => void;
export type Decoder<$Type> = (state: State) => $Type;

export type InferEncoder<$Type> = $Type extends Encoder<infer $Value>
	? $Value
	: never;

export type InferDecoder<$Type> = $Type extends Decoder<infer $Value>
	? $Value
	: never;

export type EncodeObjectSchema = {
	key: string;
	type: Encoder<any>;
}[];

export type DecodeObjectSchema = {
	key: string;
	type: Decoder<any>;
}[];

export type InferEncodeObject<$Type extends EncodeObjectSchema> = {
	[$Item in $Type[number] as $Item["key"]]: InferEncoder<$Item["type"]>;
};

export type InferDecodeObject<$Type extends DecodeObjectSchema> = {
	[$Item in $Type[number] as $Item["key"]]: InferDecoder<$Item["type"]>;
};

export type InferEncodeTuple<$Type extends Encoder<any>[]> = {
	[$Key in keyof $Type]: $Type[$Key] extends Encoder<infer $Value>
		? $Value
		: never;
};

export type InferDecodeTuple<$Type extends Decoder<any>[]> = {
	[$Key in keyof $Type]: $Type[$Key] extends Decoder<infer $Value>
		? $Value
		: never;
};
