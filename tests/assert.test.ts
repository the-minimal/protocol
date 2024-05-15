import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src/index.js";
import {UINT8} from "./shared.js";

describe("assert", () => {
    const assert = (value: unknown) => {
        if (value === 0) {
            throw new Error("zero");
        }

        return value;
    };

    test.prop([fc.integer({ min: 1, max: UINT8.max})])("passes", (value) => {
        const type = { type: Type.UInt8, assert: assert } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.constant(0)])("throws", (value) => {
        const throwType = { type: Type.UInt8, assert } as const;
        const passType = { type: Type.UInt8 } as const;

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
