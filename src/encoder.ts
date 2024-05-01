import type { Protocol } from "@types";

export class DataEncoder implements Protocol.Encoders {
	private buffer: ArrayBuffer;
	private view: DataView;
	private offset: number;

	constructor() {
		this.buffer = new ArrayBuffer(1024);
		this.view = new DataView(this.buffer);
		this.offset = 0;
	}

	run(type: any, value: unknown) {
		if (type.nullable) {
			this.view.setUint8(this.offset++, +(value === null));
		}

		(this as any)[type.type](
			type,
			type.parse && value !== null ? type.parse(value) : value,
		);
	}

	int(_: Protocol.Int, value: number) {
		this.view.setUint8(this.offset++, value);
	}

	ascii(_: Protocol.Ascii, value: string) {
		this.view.setUint8(this.offset++, value.length);

		for (let i = 0; i < value.length; ++i) {
			this.view.setUint8(this.offset++, value.charCodeAt(i));
		}
	}

	object(type: Protocol.Object, value: Record<string, unknown>) {
		for (let i = 0; i < type.properties.length; ++i) {
			this.run(type.properties[i], value[type.properties[i].key]);
		}
	}

	encode(type: Protocol.Any, value: unknown) {
		this.run(type, value);
		return this.buffer.slice(0, this.offset);
	}
}
