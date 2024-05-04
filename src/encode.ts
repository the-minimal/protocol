import type { State, Type } from "./types";
import { alloc, check, free } from "./utils";

const TYPES = {
	boolean: (state: State, _: Type.Boolean, value: boolean) => {
		state.view.setUint8(state.offset++, +value);
	},
	int: (state: State, type: Type.Int, value: number) => {
		type.size ??= 8;
		check(state, type.size / 8);
		state.view[`set${type.signed ? "Int" : "Uint"}${type.size}`](
			state.offset,
			value,
		);
		state.offset += type.size / 8;
	},
	float: (state: State, type: Type.Float, value: number) => {
		type.size ??= 32;
		check(state, type.size / 8);
		state.view[`setFloat${type.size}`](state.offset, value);
		state.offset += type.size / 8;
	},
	// TODO: add support for utf8/16
	string: (state: State, type: Type.String, value: string) => {
		type.size ??= 8;
		check(state, type.size / 8 + value.length);
		state.view[`setUint${type.size}`](state.offset, value.length);
		state.offset += type.size / 8;

		for (let i = 0; i < value.length; ++i) {
			state.view.setUint8(state.offset++, value.charCodeAt(i));
		}
	},
	object: (state: State, type: Type.Object, value: Record<string, unknown>) => {
		for (let i = 0; i < type.properties.length; ++i) {
			run(state, type.properties[i], value[type.properties[i].key]);
		}
	},
	array: (state: State, type: Type.Array, value: unknown[]) => {
		type.size ??= 8;
		check(state, type.size / 8);
		state.view[`setUint${type.size}`](state.offset, value.length);
		state.offset += type.size / 8;

		for (let i = 0; i < value.length; ++i) {
			run(state, type.item, value[i]);
		}
	},
	enum: (state: State, type: Type.Enum, value: string) => {
		state.view.setUint8(state.offset++, type.options.indexOf(value));
	},
	tuple: (state: State, type: Type.Tuple, value: unknown[]) => {
		for (let i = 0; i < type.items.length; ++i) {
			run(state, type.items[i], value[i]);
		}
	},
};

const run = (state: State, type: Type.Any, value: unknown) => {
	if (type.nullable) {
		check(state, 1);
		state.view.setUint8(state.offset++, +(value === null));

		if (value === null) {
			check(state, 1);
			state.view.setUint8(state.offset++, 0);

			return;
		}
	}

	type.assert?.(value);

	(TYPES as any)[type.type](state, type, value);
};

export const encode = (type: Type.Any, value: unknown) => {
	const state = alloc();

	run(state, type, value);

	const result = state.buffer.slice(0, state.offset);

	free(state);

	return result;
};
