import { Kind } from "./enums.js";
import type {
	AnyType,
	Encoder,
	Encoders,
	Infer,
	State,
	Type,
} from "./types/index.js";
import { alloc, free } from "./utils.js";

const encoder = new TextEncoder();

const TYPES = [
	// Boolean
	(state: State, _: Type.Boolean, value: boolean) => {
		state.view.setUint8(state.offset++, +value);
	},
	// Int
	(state: State, type: Type.Int, value: number) => {
		type.size ??= 1;

		state.view[
			`set${type.signed ? "Int" : "Uint"}${(type.size * 8) as 8 | 16 | 32}`
		](state.offset, value);

		state.offset += type.size;
	},
	// Float
	(state: State, type: Type.Float, value: number) => {
		type.size ??= 4;

		state.view[`setFloat${(type.size * 8) as 32 | 64}`](state.offset, value);

		state.offset += type.size;
	},
	// String
	(state: State, type: Type.String, value: string) => {
		type.size ??= 1;
		type.kind ??= Kind.Ascii;

		if (type.kind === Kind.Ascii) {
			state.view[`setUint${(type.size * 8) as 8 | 16}`](
				state.offset,
				value.length,
			);

			state.offset += type.size;

			for (let i = 0; i < value.length; ++i) {
				state.view.setUint8(state.offset++, value.charCodeAt(i));
			}
		} else {
			const written = encoder.encodeInto(
				value,
				new Uint8Array(state.buffer, state.offset + type.size),
			).written;

			state.view[`setUint${(type.size * 8) as 8 | 16}`](state.offset, written);
			state.offset += type.size + written;
		}
	},
	// Object
	(state: State, type: Type.Object, value: Record<string, unknown>) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[type.value[i].key]);
		}
	},
	// Array
	(state: State, type: Type.Array, value: unknown[]) => {
		type.size ??= 1;

		state.view[`setUint${(type.size * 8) as 8 | 16}`](
			state.offset,
			value.length,
		);

		state.offset += type.size;

		for (let i = 0; i < value.length; ++i) {
			run(state, type.value, value[i]);
		}
	},
	// Enum
	(state: State, type: Type.Enum, value: string) => {
		state.view.setUint8(state.offset++, type.value.indexOf(value));
	},
	// Tuple
	(state: State, type: Type.Tuple, value: unknown[]) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[i]);
		}
	},
] satisfies Encoders;

const run = (state: State, type: AnyType, value: unknown) => {
	if (type.nullable) {
		state.view.setUint8(state.offset++, +(value === null));

		if (value === null) {
			state.view.setUint8(state.offset++, 0);

			return;
		}
	}

	type.assert?.(value);

	(TYPES[type.name] as Encoder)(state, type, value);
};

export const encode = <const $Type extends AnyType>(
	type: $Type,
	value: Infer<$Type>,
	chunks = 1,
) => {
	const state = alloc(chunks);

	run(state, type, value);

	const result = state.buffer.slice(0, state.offset);

	free(state);

	return result;
};
