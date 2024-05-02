import type { Protocol } from "@types";
import type { Buffer } from "@utils";
import { alloc, check, free } from "@utils";

const TYPES = {
	int: (buffer: Buffer, _: Protocol.Int, value: number) => {
		check(buffer, 1);
		buffer.view.setUint8(buffer.offset++, value);
	},
	ascii: (buffer: Buffer, _: Protocol.Ascii, value: string) => {
		check(buffer, 1 + value.length);
		buffer.view.setUint8(buffer.offset++, value.length);

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
};

const run = (buffer: Buffer, type: any, value: unknown) => {
	if (type.nullable) {
		check(buffer, 1);
		buffer.view.setUint8(buffer.offset++, +(value === null));
	}

	if (type.parse && value !== null) {
		type.parse(value);
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
