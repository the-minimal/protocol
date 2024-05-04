import type { Position, Type } from "./types";

const TYPES = {
	boolean: (position: Position, _: Type.Boolean, view: DataView) => {
		return view.getUint8(position.offset) === 1;
	},
	int: (position: Position, type: Type.Int, view: DataView) => {
		type.size ??= 8;

		const result = view[`get${type.signed ? "Int" : "Uint"}${type.size}`](
			position.offset,
		);

		position.offset += type.size / 8;

		return result;
	},
	float: (position: Position, type: Type.Float, view: DataView) => {
		type.size ??= 32;

		const result = view[`getFloat${type.size}`](position.offset);

		position.offset += type.size / 8;

		return result;
	},
	// TODO: add support for utf8/16
	string: (position: Position, type: Type.Int, view: DataView) => {
		type.size ??= 8;

		const length = view[`getUint${type.size}`](position.offset);

		position.offset += type.size / 8;

		let result = "";

		for (let i = 0; i < length; ++i) {
			result += String.fromCharCode(view.getUint8(position.offset++));
		}

		return result;
	},
	object: (position: Position, type: Type.Object, view: DataView) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(position, type.value[i], view);
		}

		return result;
	},
	array: (position: Position, type: Type.Array, view: DataView) => {
		type.size ??= 8;

		const length = view[`getUint${type.size}`](position.offset);

		position.offset += type.size / 8;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(position, type.value, view);
		}

		return result;
	},
	enum: (position: Position, type: Type.Enum, view: DataView) => {
		return type.value[view.getUint8(position.offset++)];
	},
	tuple: (position: Position, type: Type.Tuple, view: DataView) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(position, type.value[i], view);
		}

		return result;
	},
};

const run = (position: Position, type: Type.Any, view: DataView) => {
	if (type.nullable) {
		const isNull = view.getUint8(position.offset++) === 1;

		if (isNull) {
			position.offset++;
			return null;
		}
	}

	const result = (TYPES as any)[type.type](position, type, view);

	type.assert?.(result);

	return result;
};

export const decode = (type: Type.Any, buffer: ArrayBuffer) => {
	return run({ offset: 0 }, type, new DataView(buffer));
};
