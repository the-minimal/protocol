import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Int8, Int16, Int32, NInt8, NInt16, NInt32 } from "../src/types.js";
import { INT8, INT16, INT32 } from "./shared.js";

describe("int", () => {
	test.prop([fc.integer(INT8)])("Int8", (value) => {
		const type = { type: Int8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(INT8), fc.constant(null))])(
		"NInt8",
		(value) => {
			const type = { type: NInt8 } as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toBe(value);
		},
	);

	test.prop([fc.integer(INT16)])("Int16", (value) => {
		const type = { type: Int16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(INT16), fc.constant(null))])(
		"NInt16",
		(value) => {
			const type = { type: NInt16 } as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toBe(value);
		},
	);

	test.prop([fc.integer(INT32)])("Int32", (value) => {
		const type = { type: Int32 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(INT32), fc.constant(null))])(
		"NInt32",
		(value) => {
			const type = { type: NInt32 } as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toBe(value);
		},
	);
});
