import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Type} from "../src";

beforeEach(() => init());

test.prop([fc.record({
   name: fc.string(),
   age: fc.integer({min: 0, max: 150}),
})])("object", (value) => {
    const type = {
        type: "object",
        value: [
            {key: "name", type: "string", kind: "ascii", size: 8},
            {key: "age", type: "int", size: 8},
        ]
    } satisfies Type.Object;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
