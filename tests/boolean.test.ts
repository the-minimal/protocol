import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Bool, NBool } from "../src/types.js";

describe("bool", () => {
	test.prop([fc.boolean()])("Bool", (value) => {
		const type = {
			type: Bool,
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});

	test.prop([fc.oneof(fc.boolean(), fc.constant(null))])("NBool", (value) => {
		const type = {
			type: NBool,
		} as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toEqual(value);
	});
});
