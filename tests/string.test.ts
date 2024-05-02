import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {decode, encode, Protocol} from "../src";
import {UINT16, UINT8} from "./shared";

describe("string", () => {
    describe("ascii", () => {
        test.prop([fc.string({ maxLength: UINT8.max })])("8", (value) => {
            const type = { type: "string", kind: "ascii", size: 8 } satisfies Protocol.String;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test.prop([fc.string({ maxLength: UINT16.max })])("16", (value) => {
            const type = { type: "string", kind: "ascii", size: 16 } satisfies Protocol.String;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });

    // TODO: once utf8/16 are implemented, add tests for them
});