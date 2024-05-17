import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Array8, Array16, NArray8, NArray16, UInt8 } from "../src/types.js";
import { UINT8, UINT16 } from "./shared.js";

describe("array", () => {
	test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT8.max })])(
		"Array8",
		(value) => {
			const type = {
				type: Array8,
				value: { type: UInt8 },
			} as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(bytes).toBe(257);
			expect(chunks).toBe(1);
			expect(encoded.byteLength).toBe(1 + value.length);
			expect(decoded).toEqual(value);
		},
	);

	test.prop([
		fc.oneof(
			fc.array(fc.integer(UINT8), { maxLength: UINT8.max }),
			fc.constant(null),
		),
	])("NArray8", (value) => {
		const type = {
			type: NArray8,
			value: { type: UInt8 },
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(258);
		expect(chunks).toBe(1);
		expect(encoded.byteLength).toBe(
			value === null || value.length === 0 ? 2 : 2 + value.length,
		);
		expect(decoded).toEqual(value);
	});

	test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT16.max })])(
		"Array16",
		(value) => {
			const type = {
				type: Array16,
				value: { type: UInt8 },
			} as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(bytes).toBe(65538);
			expect(chunks).toBe(9);
			expect(encoded.byteLength).toBe(2 + value.length);
			expect(decoded).toEqual(value);
		},
	);

	test.prop([
		fc.oneof(
			fc.array(fc.integer(UINT8), { maxLength: UINT16.max }),
			fc.constant(null),
		),
	])("NArray16", (value) => {
		const type = {
			type: NArray16,
			value: { type: UInt8 },
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(65539);
		expect(chunks).toBe(9);
		expect(encoded.byteLength).toBe(value === null ? 2 : 3 + value.length);
		expect(decoded).toEqual(value);
	});
});
