import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Type} from "../src";
import {UINT16, UINT8} from "./shared";

describe("string", () => {
    beforeEach(() => init());

    describe("ascii", () => {
        test.prop([fc.string({ maxLength: UINT8.max })])("8", (value) => {
            const type = { type: "string", kind: "ascii", size: 8 } satisfies Type.String;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test.prop([fc.string({ maxLength: UINT16.max })])("16", (value) => {
            const type = { type: "string", kind: "ascii", size: 16 } satisfies Type.String;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });

    describe("utf8", () => {
        test("8", () => {
            const type = { type: "string", kind: "utf8", size: 8 } satisfies Type.String;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test("16", () => {
            const type = { type: "string", kind: "utf8", size: 16 } satisfies Type.String;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });

});
