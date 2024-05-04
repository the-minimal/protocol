import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Type} from "../src";
import {UINT8} from "./shared";

beforeEach(() => init());

test.prop([fc.tuple(fc.integer(UINT8), fc.string())])("tuple", (value) => {
    const type = {
        type: "tuple",
        value: [
            {type: "int", size: 8},
            {type: "string", kind: "ascii", size: 8},
        ]
    } satisfies Type.Tuple;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
