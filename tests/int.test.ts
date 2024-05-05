import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Name } from "../src";
import {INT16, INT32, INT8, UINT16, UINT32, UINT8} from "./shared";

describe("int", () => {
    beforeEach(() => init());

    test.prop([fc.integer(UINT8)])("uint8", (value) => {
        const type = { name: Name.Int, size: 1, signed: false } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT16)])("uint16", (value) => {
        const type = { name: Name.Int, size: 2, signed: false } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT32)])("uint32", (value) => {
        const type = { name: Name.Int, size: 4, signed: false } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT8)])("int8", (value) => {
        const type = { name: Name.Int, size: 1, signed: true } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT16)])("int16", (value) => {
        const type = { name: Name.Int, size: 2, signed: true } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT32)])("int32", (value) => {
        const type = { name: Name.Int, size: 4, signed: true } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});
