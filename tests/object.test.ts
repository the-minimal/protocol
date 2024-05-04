import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {decode, encode, Type} from "../src";
import {UINT8} from "./shared";

test.prop([fc.record({
   name: fc.string(),
   age: fc.integer({min: 0, max: 150}),
})])("object", (value) => {
    const type = {
        type: "object",
        properties: [
            {key: "name", type: "string", kind: "ascii", size: 8},
            {key: "age", type: "int", size: 8},
        ]
    } satisfies Type.Object;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
