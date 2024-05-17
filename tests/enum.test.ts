import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Enum, NEnum } from "../src/types.js";

describe("enum", () => {
	test.prop([fc.oneof(fc.constant("ADMIN"), fc.constant("USER"))])(
		"Enum",
		(value) => {
			const type = {
				type: Enum,
				value: ["ADMIN", "USER"],
			} as const satisfies Protocol.Any;

			const encoded = encode(type, value as any);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toEqual(value);
		},
	);

	test.prop([fc.oneof(fc.constant("ADMIN"), fc.constant("USER"))])(
		"NEnum",
		(value) => {
			const type = {
				type: NEnum,
				value: ["ADMIN", "USER"],
			} as const satisfies Protocol.Any;

			const encoded = encode(type, value as any);
			const { bytes, chunks } = estimate(type);
			const decoded = decode(type, encoded);

			expect(encoded).toBeInstanceOf(ArrayBuffer);
			expect(value === null ? 2 : bytes).toBe(encoded.byteLength);
			expect(chunks).toBe(1);
			expect(decoded).toEqual(value);
		},
	);
});
