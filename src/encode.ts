import type { Protocol } from "@types";
import type { Buffer } from "@utils";
import { alloc, check, free } from "@utils";

const TYPES = {
	int: (buffer: Buffer, type: Protocol.Int, value: number) => {
		const size = type.size ?? 8;
		const bytes = size / 8;

		check(buffer, bytes);
		buffer.view[`set${type.unsigned ? "Uint" : "Int"}${size}`](
			buffer.offset,
			value,
		);
		buffer.offset += bytes;
	},
	float: (buffer: Buffer, type: Protocol.Float, value: number) => {
		const size = type.size ?? 32;
		const bytes = size / 8;

		check(buffer, bytes);
		buffer.view[`setFloat${size}`](buffer.offset, value);
		buffer.offset += bytes;
	},
	ascii: (buffer: Buffer, type: Protocol.Ascii, value: string) => {
		const size = type.size ?? 8;
		const bytes = size / 8;

		check(buffer, bytes + value.length);
		buffer.view[`setUint${size}`](buffer.offset, value.length);
		buffer.offset += bytes;

		for (let i = 0; i < value.length; ++i) {
			buffer.view.setUint8(buffer.offset++, value.charCodeAt(i));
		}
	},
	object: (
		buffer: Buffer,
		type: Protocol.Object,
		value: Record<string, unknown>,
	) => {
		for (let i = 0; i < type.properties.length; ++i) {
			run(buffer, type.properties[i], value[type.properties[i].key]);
		}
	},
	array: (buffer: Buffer, type: Protocol.Array, value: unknown[]) => {
		const size = type.size ?? 8;
		const bytes = size / 8;

		check(buffer, bytes);
		buffer.view[`setUint${size}`](buffer.offset, value.length);
		buffer.offset += bytes;

		for (let i = 0; i < value.length; ++i) {
			run(buffer, type.item, value[i]);
		}
	},
	enum: (buffer: Buffer, type: Protocol.Enum, value: string) => {
		buffer.view.setUint8(buffer.offset++, type.options.indexOf(value));
	},
};

const run = (buffer: Buffer, type: any, value: unknown) => {
	const isNull = value === null;

	if (type.nullable) {
		check(buffer, 1);
		buffer.view.setUint8(buffer.offset++, +isNull);

		if (isNull) {
			check(buffer, 1);
			buffer.view.setUint8(buffer.offset++, 0);

			return;
		}
	}

	if (type.assert) {
		type.assert(value);
	}

	(TYPES as any)[type.type](buffer, type, value);
};

export const encode = (type: Protocol.Any, value: unknown) => {
	const buffer = alloc();

	run(buffer, type, value);

	const result = buffer.buffer.slice(0, buffer.offset);

	free(buffer);

	return result;
};
