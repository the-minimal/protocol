import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {INT16, INT32, INT8, UINT16, UINT32, UINT8} from "./shared.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";
import { Int16, Int32, Int8, UInt16, UInt32, UInt8 } from "../src/types.js";

describe("int", () => {
    test.prop([fc.integer(UINT8)])("uint8", (value) => {
        const type = { type: UInt8 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT16)])("uint16", (value) => {
        const type = { type: UInt16 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT32)])("uint32", (value) => {
        const type = { type: UInt32 } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT8)])("int8", (value) => {
        const type = { type: Int8} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT16)])("int16", (value) => {
        const type = { type: Int16} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT32)])("int32", (value) => {
        const type = { type: Int32} as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
