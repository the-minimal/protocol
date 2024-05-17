import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {UINT16, UINT8} from "./shared.js";
import { Array16, Array8, UInt8 } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

describe("array", () => {
    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT8.max })])("8", (value) => {
        const type = {
            type: Array8,
            value: { type: UInt8 }
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT16.max })])("8", (value) => {
        const type = {
            type: Array16,
            value: { type: UInt8 }
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });
});
