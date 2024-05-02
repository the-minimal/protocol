import type { Protocol } from "@types";

type Position = {
	offset: number;
};

const TYPES = {
	int: (position: Position, _: Protocol.Int, view: DataView) => {
		return view.getUint8(position.offset++);
	},
	ascii: (position: Position, _: Protocol.Int, view: DataView) => {
		const length = view.getUint8(position.offset++);

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
};

const run = (position: Position, type: any, view: DataView) => {
	if (type.nullable && view.getUint8(position.offset++) === 1) {
		return null;
	}

	const result = (TYPES as any)[type.type](position, type, view);

	if (type.parse) {
		type.parse(result);
	}

	return result;
};

export const decode = (type: Protocol.Any, buffer: ArrayBuffer) => {
	return run({ offset: 0 }, type, new DataView(buffer));
};
