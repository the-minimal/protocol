import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Name, Type} from "../src";
import {UINT8} from "./shared";

describe("assert", () => {
    beforeEach(() => init());

    const assert = (value: unknown) => {
        if (value === 0) {
            throw new Error("zero");
        }

        return value;
    };

    test.prop([fc.integer({ min: 1, max: UINT8.max})])("passes", (value) => {
        const type = { name: Name.Int, size: 1, assert } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.constant(0)])("throws", (value) => {
        const throwType = { name: Name.Int, size: 1, assert } satisfies Type.Int;
        const passType = { name: Name.Int, size: 1 } satisfies Type.Int;

        expect(() => encode(throwType, value)).toThrow("zero");

        const encoded = encode(passType, value);

        expect(() => decode(throwType, encoded)).toThrow("zero");
    });
});
