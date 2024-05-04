import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src";

describe("float", () => {
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