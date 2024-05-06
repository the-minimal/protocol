import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Name, Type} from "../src/index.js";
import {UINT8} from "./shared.js";

describe("nullable", () => {
    beforeEach(() => init());

    test.prop([fc.oneof(fc.integer(UINT8), fc.constant(null))])("true", (value) => {
        const type = { name: Name.Int, size: 1, nullable: true } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT8)])("false", (value) => {
        const type = { name: Name.Int, size: 1, nullable: false } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
