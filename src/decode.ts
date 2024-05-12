import { error } from "@the-minimal/error";
import { Kind } from "./enums.js";
import type {
	AnyProtocolType,
	Decoder,
	Decoders,
	Infer,
	Protocol,
	State,
} from "./types/index.js";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const TYPES = [
	// Boolean
	(state: State, _: Protocol.Boolean) => {
		return state.view.getUint8(state.offset) === 1;
	},
	// Int
	(state: State, type: Protocol.Int) => {
		type.size ??= 1;

		const result = state.view[
			`get${type.signed ? "Int" : "Uint"}${(type.size * 8) as 8 | 16 | 32}`
		](state.offset);

		state.offset += type.size;

		return result;
	},
	// Float
	(state: State, type: Protocol.Float) => {
		type.size ??= 4;

		const result = state.view[`getFloat${(type.size * 8) as 32 | 64}`](
			state.offset,
		);

		state.offset += type.size;

		return result;
	},
	// String
	(state: State, type: Protocol.String) => {
		type.size ??= 1;
		type.kind ??= Kind.Ascii;

		const length = state.view[`getUint${(type.size * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += type.size;

		const result = (type.kind === Kind.Ascii ? ascii : utf8).decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	// Object
	(state: State, type: Protocol.Object) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	// Array
	(state: State, type: Protocol.Array) => {
		type.size ??= 1;

		const length = state.view[`getUint${(type.size * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += type.size;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(state, type.value);
		}

		return result;
	},
	// Enum
	(state: State, type: Protocol.Enum) => {
		return type.value[state.view.getUint8(state.offset++)];
	},
	// Tuple
	(state: State, type: Protocol.Tuple) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
] satisfies Decoders;

const run = (state: State, type: AnyProtocolType) => {
	if (type.nullable) {
		const isNull = state.view.getUint8(state.offset++) === 1;

		if (isNull) {
			state.offset++;
			return null;
		}
	}

	const result = (TYPES[type.type] as Decoder)(state, type);

	type.assert?.(result);

	return result;
};

export const decode = (<$Type extends AnyProtocolType>(
	type: $Type,
	buffer: ArrayBuffer,
) => {
	try {
		return run(
			{
				offset: 0,
				buffer,
				view: new DataView(buffer),
				index: 0,
				chunks: 0,
			},
			type,
		) as Infer<$Type>;
	} catch (e: any) {
		DecodeError(e, e?.message);
	}
}) as <$Type extends AnyProtocolType>(
	type: $Type,
	buffer: ArrayBuffer,
) => Infer<$Type>;
