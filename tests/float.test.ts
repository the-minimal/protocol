import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import { Float32, Float64 } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

describe("float", () => {
    test.prop([fc.float()])("float32", (value) => {
        const type = { type: Float32 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer()])("float64", (value) => {
        const type = { type: Float64 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
