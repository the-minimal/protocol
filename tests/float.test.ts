import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Float32, Float64, NFloat32, NFloat64 } from "../src/types.js";

describe("float", () => {
	test.prop([fc.float()])("Float32", (value) => {
		const type = { type: Float32 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});

	test.prop([fc.oneof(fc.float(), fc.constant(null))])("NFloat32", (value) => {
		const type = { type: NFloat32 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});

	test.prop([fc.float()])("Float64", (value) => {
		const type = { type: Float64 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});

	test.prop([fc.oneof(fc.float(), fc.constant(null))])("NFloat64", (value) => {
		const type = { type: NFloat64 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});
});
