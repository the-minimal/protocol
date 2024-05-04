import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Type} from "../src";

describe("float", () => {
    beforeEach(() => init());

    test.prop([fc.float()])("float32", (value) => {
        const type = { type: "float", size: 32 } satisfies Type.Float;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer()])("float64", (value) => {
        const type = { type: "float", size: 64 } satisfies Type.Float;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});