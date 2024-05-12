import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Kind, Type} from "../src/index.js";
import {UINT8} from "./shared.js";

beforeEach(() => init());

test.prop([fc.tuple(fc.integer(UINT8), fc.string())])("tuple", (value) => {
    const type = {
        type: Type.Tuple,
        value: [
            {type: Type.Int, size: 1},
            {type: Type.String, kind: Kind.Ascii, size: 1},
        ]
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
