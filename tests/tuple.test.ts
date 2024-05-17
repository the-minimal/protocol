import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {UINT8} from "./shared.js";
import { Ascii8, Tuple, UInt8 } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

test.prop([fc.tuple(fc.integer(UINT8), fc.string())])("tuple", (value) => {
    const type = {
        type: Tuple,
        value: [
            {type: UInt8},
            {type: Ascii8},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
