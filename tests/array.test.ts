import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Name} from "../src";
import {UINT16, UINT8} from "./shared";

describe("array", () => {
    beforeEach(() => init());

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT8.max })])("8", (value) => {
        const type = {
            name: Name.Array,
            size: 1,
            value: {name: Name.Int, size: 1}
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });

    test.prop([fc.array(fc.integer(UINT8), { maxLength: UINT16.max })])("8", (value) => {
        const type = {
            name: Name.Array,
            size: 2,
            value: {name: Name.Int, size: 1}
        } as const;

        const encoded = encode(type, value);
        const decoded = decode(type, encoded);

        expect(decoded).toEqual(value);
    });
});
