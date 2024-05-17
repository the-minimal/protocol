import { fc, test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { decode } from "../src/decode.js";
import { encode } from "../src/encode.js";
import { estimate } from "../src/estimate.js";
import type { Protocol } from "../src/index.js";
import { Bool, NTuple, Tuple, UInt8 } from "../src/types.js";
import { UINT8 } from "./shared.js";

describe("tuple", () => {
	test.prop([fc.tuple(fc.integer(UINT8), fc.boolean())])("Tuple", (value) => {
		const type = {
			type: Tuple,
			value: [{ type: UInt8 }, { type: Bool }],
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
		fc.oneof(fc.tuple(fc.integer(UINT8), fc.boolean()), fc.constant(null)),
	])("NTuple", (value) => {
		const type = {
			type: NTuple,
			value: [{ type: UInt8 }, { type: Bool }],
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
