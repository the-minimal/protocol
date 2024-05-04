import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Type} from "../src";

beforeEach(() => init());

test.prop([fc.boolean()])("boolean", (value) => {
    const type = {
        type: "boolean",
    } satisfies Type.Boolean;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
