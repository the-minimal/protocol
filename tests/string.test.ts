import {fc, test} from "@fast-check/vitest";
import {beforeEach, describe, expect} from "vitest";
import {decode, encode, init, Kind, Type} from "../src/index.js";
import {UINT16, UINT8} from "./shared.js";

describe("string", () => {
    beforeEach(() => init());

    describe("ascii", () => {
        test.prop([fc.string({ maxLength: UINT8.max })])("8", (value) => {
            const type = { type: Type.String, kind: Kind.Ascii, size: 1 } as const;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test.prop([fc.string({ maxLength: UINT16.max })])("16", (value) => {
            const type = { type: Type.String, kind: Kind.Ascii, size: 2 } as const;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });

    describe("utf8", () => {
        test("8", () => {
            const type = { type: Type.String, kind: Kind.Utf8, size: 1 } as const;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test("16", () => {
            const type = { type: Type.String, kind: Kind.Utf8, size: 2 } as const;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });
});
