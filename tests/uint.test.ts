import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import {
	NUInt8,
	NUInt16,
	NUInt32,
	UInt8,
	UInt16,
	UInt32,
} from "../src/types.js";
import { UINT8, UINT16, UINT32 } from "./shared.js";

describe("uint", () => {
	test.prop([fc.integer(UINT8)])("UInt8", (value) => {
		const type = { type: UInt8 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(UINT8), fc.constant(null))])(
		"NUInt8",
		(value) => {
			const type = { type: NUInt8 } as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toBe(value);
		},
	);

	test.prop([fc.integer(UINT16)])("UInt16", (value) => {
		const type = { type: UInt16 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(UINT16), fc.constant(null))])(
		"NUInt16",
		(value) => {
			const type = { type: NUInt16 } as const satisfies Protocol.Any;

			const encoded = encode(type, value);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toBe(value);
		},
	);

	test.prop([fc.integer(UINT32)])("UInt32", (value) => {
		const type = { type: UInt32 } as const satisfies Protocol.Any;

		const encoded = encode(type, value);
		const { bytes, chunks } = estimate(type);
		const decoded = decode(type, encoded);

		expect(encoded).toBeInstanceOf(ArrayBuffer);
		expect(bytes).toBe(encoded.byteLength);
		expect(chunks).toBe(1);
		expect(decoded).toBe(value);
	});

	test.prop([fc.oneof(fc.integer(UINT32), fc.constant(null))])(
		"NUInt32",
		(value) => {
			const type = { type: NUInt32 } as const satisfies Protocol.Any;

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
