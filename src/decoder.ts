import type { Protocol } from "@types";

export class DataDecoder implements Protocol.Decoders {
	private offset: number;

	constructor() {
		this.offset = 0;
	}

	run(type: any, view: DataView) {
		if (type.nullable && view.getUint8(this.offset++) === 1) {
			return null;
		}

		return type.parse
			? type.parse((this as any)[type.type](type, view))
			: (this as any)[type.type](type, view);
	}

	int(_: Protocol.Int, view: DataView) {
		return view.getUint8(this.offset++);
	}

	ascii(_: Protocol.Int, view: DataView) {
		const length = view.getUint8(this.offset++);

		let result = "";

		for (let i = 0; i < length; ++i) {
			result += String.fromCharCode(view.getUint8(this.offset++));
		}

		return result;
	}

	object(type: Protocol.Object, view: DataView) {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.properties.length; ++i) {
			result[type.properties[i].key] = this.run(type.properties[i], view);
		}

		return result;
	}

	decode(type: Protocol.Any, buffer: ArrayBuffer) {
		return this.run(type, new DataView(buffer));
	}
}
