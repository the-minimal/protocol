import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src";
import {UINT8} from "./shared";

describe("nullable", () => {
    test.prop([fc.oneof(fc.integer(UINT8), fc.constant(null))])("true", (value) => {
        const type = { type: "int", size: 8, nullable: true } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT8)])("false", (value) => {
        const type = { type: "int", size: 8, nullable: false } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});