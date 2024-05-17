import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Ascii8, Ascii16, NAscii8, NAscii16 } from "../src/types.js";
import { UINT8, UINT16 } from "./shared.js";

describe("ascii", () => {
	test.prop([fc.string({ maxLength: UINT8.max })])("Ascii8", (value) => {
		const type = { type: Ascii8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(257);
		expect(chunks).toBe(1);
		expect(encoded.byteLength).toBe(1 + value.length);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT8.max })])("NAscii8", (value) => {
		const type = { type: NAscii8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(258);
		expect(chunks).toBe(1);
		expect(encoded.byteLength).toBe(
			value === null || value.length === 0 ? 2 : 2 + value.length,
		);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT16.max })])("Ascii16", (value) => {
		const type = { type: Ascii16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(65538);
		expect(chunks).toBe(9);
		expect(encoded.byteLength).toBe(2 + value.length);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT16.max })])("NAscii16", (value) => {
		const type = { type: NAscii16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(65539);
		expect(chunks).toBe(9);
		expect(encoded.byteLength).toBe(value === null ? 2 : 3 + value.length);
		expect(decoded).toBe(value);
	});
});
