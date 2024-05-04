import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src";
import {UINT16, UINT8} from "./shared";

describe("array", () => {
    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT8.max })])("8", (value) => {
        const type = {
            type: "array",
            size: 8,
            item: {type: "int", size: 8}
        } satisfies Type.Array;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT16.max })])("8", (value) => {
        const type = {
            type: "array",
            size: 16,
            item: {type: "int", size: 8}
        } satisfies Type.Array;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });
});