import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import { Bool } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

test.prop([fc.boolean()])("bool", (value) => {
    const type = {
        type: Bool,
    } as const;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
