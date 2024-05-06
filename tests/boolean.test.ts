import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Name, Type} from "../src/index.js";

beforeEach(() => init());

test.prop([fc.boolean()])("boolean", (value) => {
    const type = {
        name: Name.Boolean,
    } satisfies Type.Boolean;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
