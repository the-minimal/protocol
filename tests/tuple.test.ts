import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {decode, encode, Type} from "../src/index.js";
import {UINT8} from "./shared.js";

test.prop([fc.tuple(fc.integer(UINT8), fc.string())])("tuple", (value) => {
    const type = {
        type: Type.Tuple,
        value: [
            {type: Type.UInt8},
            {type: Type.Ascii8},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
