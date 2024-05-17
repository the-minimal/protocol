import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import { Ascii8, Struct, UInt8 } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

test.prop([fc.record({
   name: fc.string(),
   age: fc.integer({min: 0, max: 150}),
})])("struct", (value) => {
    const type = {
        type: Struct,
        value: [
            {key: "name", type: Ascii8 },
            {key: "age", type: UInt8},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
