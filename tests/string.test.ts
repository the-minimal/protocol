import {fc, test} from "@fast-check/vitest";
import {describe, expect} from "vitest";
import {UINT16, UINT8} from "./shared.js";
import { Ascii16, Ascii8, Unicode16, Unicode8 } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

describe("string", () => {
    describe("ascii", () => {
        test.prop([fc.string({ maxLength: UINT8.max })])("8", (value) => {
            const type = { type: Ascii8 } as const;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test.prop([fc.string({ maxLength: UINT16.max })])("16", (value) => {
            const type = { type: Ascii16 } as const;

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });

    describe("utf8", () => {
        test("8", () => {
            const type = { type: Unicode8 } as const;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });

        test("16", () => {
            const type = { type: Unicode16 } as const;
            const value = "ᥞH놀tDҚKh~Ӷ牅򞿫Ⱥ򐻗*񩳾䷂Q🚂֔񴕈̾彷񩺞%ޮ􀯥򲰕沤礓ͷ񏴶";

            const encoded = encode(type, value);
            const decoded = decode(type, encoded);

            expect(decoded).toBe(value);
        });
    });
});
