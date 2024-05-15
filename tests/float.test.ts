import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src/index.js";

describe("float", () => {
    test.prop([fc.float()])("float32", (value) => {
        const type = { type: Type.Float32 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer()])("float64", (value) => {
        const type = { type: Type.Float64 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
