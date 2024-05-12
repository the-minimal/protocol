import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Protocol, Type} from "../src/index.js";
import {UINT8} from "./shared.js";

describe("assert", () => {
    beforeEach(() => init());

    const assert = (value: unknown) => {
        if (value === 0) {
            throw new Error("zero");
        }

        return value;
    };

    test.prop([fc.integer({ min: 1, max: UINT8.max})])("passes", (value) => {
        const type = { type: Type.Int, size: 1, assert } satisfies Protocol.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.constant(0)])("throws", (value) => {
        const throwType = { type: Type.Int, size: 1, assert } satisfies Protocol.Int;
        const passType = { type: Type.Int, size: 1 } satisfies Protocol.Int;

        try {
            encode(throwType, value);
        } catch (e: any) {
            expect(e).toBeDefined();
            expect(e.name).toBe("EncodeError");
            expect(e.message).toBe("zero");
            expect(e.cause).toBeInstanceOf(Error);
        }

        const encoded = encode(passType, value);

        try {
            decode(throwType, encoded);
        } catch (e: any) {
            expect(e).toBeDefined();
            expect(e.name).toBe("DecodeError");
            expect(e.message).toBe("zero");
            expect(e.cause).toBeInstanceOf(Error);
        }
    });
});
