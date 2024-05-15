import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Type} from "../src/index.js";
import {UINT16, UINT8} from "./shared.js";

describe("array", () => {
    beforeEach(() => init());

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT8.max })])("8", (value) => {
        const type = {
            type: Type.Array8,
            value: { type: Type.UInt8 }
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT16.max })])("8", (value) => {
        const type = {
            type: Type.Array16,
            value: { type: Type.UInt8 }
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });
});
