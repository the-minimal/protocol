import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Type} from "../src/index.js";

beforeEach(() => init());

test.prop([fc.record({
   name: fc.string(),
   age: fc.integer({min: 0, max: 150}),
})])("object", (value) => {
    const type = {
        type: Type.Object,
        value: [
            {key: "name", type: Type.Ascii8 },
            {key: "age", type: Type.UInt8},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
