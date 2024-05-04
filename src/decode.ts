import type { Infer, State, Type } from "./types";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const TYPES = {
	boolean: (state: State, _: Type.Boolean) => {
		return state.view.getUint8(state.offset) === 1;
	},
	int: (state: State, type: Type.Int) => {
		type.size ??= 8;

		const result = state.view[`get${type.signed ? "Int" : "Uint"}${type.size}`](
			state.offset,
		);

		state.offset += type.size / 8;

		return result;
	},
	float: (state: State, type: Type.Float) => {
		type.size ??= 32;

		const result = state.view[`getFloat${type.size}`](state.offset);

		state.offset += type.size / 8;

		return result;
	},
	string: (state: State, type: Type.String) => {
		type.size ??= 8;
		type.kind ??= "ascii";

		const length = state.view[`getUint${type.size}`](state.offset);

		state.offset += type.size / 8;

		const result = (type.kind === "ascii" ? ascii : utf8).decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	object: (state: State, type: Type.Object) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	array: (state: State, type: Type.Array) => {
		type.size ??= 8;

		const length = state.view[`getUint${type.size}`](state.offset);

		state.offset += type.size / 8;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(state, type.value);
		}

		return result;
	},
	enum: (state: State, type: Type.Enum) => {
		return type.value[state.view.getUint8(state.offset++)];
	},
	tuple: (state: State, type: Type.Tuple) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
};

const run = (state: State, type: Type.Any) => {
	if (type.nullable) {
		const isNull = state.view.getUint8(state.offset++) === 1;

		if (isNull) {
			state.offset++;
			return null;
		}
	}

	const result = (TYPES as any)[type.type](state, type);

	type.assert?.(result);

	return result;
};

export const decode = <$Type extends Type.Any>(
	type: $Type,
	buffer: ArrayBuffer,
) => {
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
};
