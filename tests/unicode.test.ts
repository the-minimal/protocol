import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { NUnicode8, NUnicode16, Unicode8, Unicode16 } from "../src/types.js";
import { UINT8, UINT16 } from "./shared.js";

describe("unicode", () => {
	test.prop([fc.string({ maxLength: UINT8.max })])("Unicode8", (value) => {
		const type = { type: Unicode8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(769);
		expect(chunks).toBe(1);
		expect(encoded.byteLength).toBe(1 + value.length);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT8.max })])("NUnicode8", (value) => {
		const type = { type: NUnicode8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(770);
		expect(chunks).toBe(1);
		expect(encoded.byteLength).toBe(
			value === null || value.length === 0 ? 2 : 2 + value.length,
		);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT16.max })])("Unicode16", (value) => {
		const type = { type: Unicode16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(196610);
		expect(chunks).toBe(25);
		expect(encoded.byteLength).toBe(2 + value.length);
		expect(decoded).toBe(value);
	});

	test.prop([fc.string({ maxLength: UINT16.max })])("NUnicode16", (value) => {
		const type = { type: NUnicode16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(196611);
		expect(chunks).toBe(25);
		expect(encoded.byteLength).toBe(value === null ? 2 : 3 + value.length);
		expect(decoded).toBe(value);
	});
});
