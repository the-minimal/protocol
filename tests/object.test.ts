import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Kind, Name} from "../src";

beforeEach(() => init());

test.prop([fc.record({
   name: fc.string(),
   age: fc.integer({min: 0, max: 150}),
})])("object", (value) => {
    const type = {
        name: Name.Object,
        value: [
            {key: "name", name: Name.String, kind: Kind.Ascii, size: 1},
            {key: "age", name: Name.Int, size: 1},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
