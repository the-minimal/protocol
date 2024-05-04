import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Type} from "../src";
import {INT16, INT32, INT8, UINT16, UINT32, UINT8} from "./shared";

describe("int", () => {
    test.prop([fc.integer(UINT8)])("uint8", (value) => {
        const type = { type: "int", size: 8, signed: false } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT16)])("uint16", (value) => {
        const type = { type: "int", size: 16, signed: false } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(UINT32)])("uint32", (value) => {
        const type = { type: "int", size: 32, signed: false } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT8)])("int8", (value) => {
        const type = { type: "int", size: 8, signed: true } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT16)])("int16", (value) => {
        const type = { type: "int", size: 16, signed: true } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });

    test.prop([fc.integer(INT32)])("int32", (value) => {
        const type = { type: "int", size: 32, signed: true } satisfies Type.Int;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toBe(value);
    });
});