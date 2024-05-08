import { error } from "@the-minimal/error";
import { Kind } from "./enums.js";
import type {
	AnyType,
	Decoder,
	Decoders,
	Infer,
	State,
	Type,
} from "./types/index.js";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const TYPES = [
	// Boolean
	(state: State, _: Type.Boolean) => {
		return state.view.getUint8(state.offset) === 1;
	},
	// Int
	(state: State, type: Type.Int) => {
		type.size ??= 1;

		const result = state.view[
			`get${type.signed ? "Int" : "Uint"}${(type.size * 8) as 8 | 16 | 32}`
		](state.offset);

		state.offset += type.size;

		return result;
	},
	// Float
	(state: State, type: Type.Float) => {
		type.size ??= 4;

		const result = state.view[`getFloat${(type.size * 8) as 32 | 64}`](
			state.offset,
		);

		state.offset += type.size;

		return result;
	},
	// String
	(state: State, type: Type.String) => {
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
	(state: State, type: Type.Object) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	// Array
	(state: State, type: Type.Array) => {
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
	(state: State, type: Type.Enum) => {
		return type.value[state.view.getUint8(state.offset++)];
	},
	// Tuple
	(state: State, type: Type.Tuple) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
] satisfies Decoders;

const run = (state: State, type: AnyType) => {
	if (type.nullable) {
		const isNull = state.view.getUint8(state.offset++) === 1;

		if (isNull) {
			state.offset++;
			return null;
		}
	}

	const result = (TYPES[type.name] as Decoder)(state, type);

	type.assert?.(result);

	return result;
};

export const decode = (<$Type extends AnyType>(
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
}) as <$Type extends AnyType>(type: $Type, buffer: ArrayBuffer) => Infer<$Type>;
