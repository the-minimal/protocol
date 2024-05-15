import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {Type, decode, encode} from "../src/index.js";
import {INT16, INT32, INT8, UINT16, UINT32, UINT8} from "./shared.js";

describe("int", () => {
    test.prop([fc.integer(UINT8)])("uint8", (value) => {
        const type = { type: Type.UInt8 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT16)])("uint16", (value) => {
        const type = { type: Type.UInt16 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT32)])("uint32", (value) => {
        const type = { type: Type.UInt32 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT8)])("int8", (value) => {
        const type = { type: Type.Int8} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT16)])("int16", (value) => {
        const type = { type: Type.Int16} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT32)])("int32", (value) => {
        const type = { type: Type.Int32} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
