import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {decode, encode, Type} from "../src";
import {UINT8} from "./shared";

test.prop([fc.tuple(fc.integer(UINT8), fc.string())])("tuple", (value) => {
    const type = {
        type: "tuple",
        items: [
            {type: "int", size: 8},
            {type: "string", kind: "ascii", size: 8},
        ]
    } satisfies Type.Tuple;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
