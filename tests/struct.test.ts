import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Bool, NStruct, Struct, UInt8 } from "../src/types.js";

describe("struct", () => {
	test.prop([
		fc.record({
			a: fc.boolean(),
			b: fc.integer({ min: 0, max: 255 }),
		}),
	])("Struct", (value) => {
		const type = {
			type: Struct,
			value: [
				{ key: "a", type: Bool },
				{ key: "b", type: UInt8 },
			],
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});

	test.prop([
		fc.oneof(
			fc.record({
				a: fc.boolean(),
				b: fc.integer({ min: 0, max: 255 }),
			}),
			fc.constant(null),
		),
	])("NStruct", (value) => {
		const type = {
			type: NStruct,
			value: [
				{ key: "a", type: Bool },
				{ key: "b", type: UInt8 },
			],
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});
});
