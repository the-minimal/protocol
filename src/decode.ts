import type { Protocol } from "./types";

type Position = {
	offset: number;
};

const TYPES = {
	boolean: (position: Position, _: Protocol.Boolean, view: DataView) => {
		return view.getUint8(position.offset) === 1;
	},
	int: (position: Position, type: Protocol.Int, view: DataView) => {
		const size = type.size ?? 8;
		const bytes = size / 8;
		const result = view[`get${type.signed ? "Int" : "Uint"}${size}`](
			position.offset,
		);

		position.offset += bytes;

		return result;
	},
	float: (position: Position, type: Protocol.Float, view: DataView) => {
		const size = type.size ?? 32;
		const bytes = size / 8;
		const result = view[`getFloat${size}`](position.offset);

		position.offset += bytes;

		return result;
	},
	// TODO: add support for utf8/16
	string: (position: Position, type: Protocol.Int, view: DataView) => {
		const size = type.size ?? 8;
		const bytes = size / 8;
		const length = view[`getUint${size}`](position.offset);

		position.offset += bytes;

		let result = "";

		for (let i = 0; i < length; ++i) {
			result += String.fromCharCode(view.getUint8(position.offset++));
		}

		return result;
	},
	object: (position: Position, type: Protocol.Object, view: DataView) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.properties.length; ++i) {
			result[type.properties[i].key] = run(position, type.properties[i], view);
		}

		return result;
	},
	array: (position: Position, type: Protocol.Array, view: DataView) => {
		const size = type.size ?? 8;
		const bytes = size / 8;
		const length = view[`getUint${size}`](position.offset);

		position.offset += bytes;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(position, type.item, view);
		}

		return result;
	},
	enum: (position: Position, type: Protocol.Enum, view: DataView) => {
		return type.options[view.getUint8(position.offset++)];
	},
	tuple: (position: Position, type: Protocol.Tuple, view: DataView) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.items.length; ++i) {
			result[i] = run(position, type.items[i], view);
		}

		return result;
	},
};

const run = (position: Position, type: any, view: DataView) => {
	if (typeof type === "string") {
		type = { type };
	}

	if (type.nullable) {
		const isNull = view.getUint8(position.offset++) === 1;

		if (isNull) {
			position.offset++;
			return null;
		}
	}

	const result = (TYPES as any)[type.type](position, type, view);

	if (type.assert) {
		type.assert(result);
	}

	return result;
};

export const decode = (type: Protocol.Any | string, buffer: ArrayBuffer) => {
	return run({ offset: 0 }, type, new DataView(buffer));
};
