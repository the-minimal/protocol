import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {decode, encode, Type} from "../src";

test.prop([fc.boolean()])("boolean", (value) => {
    const type = {
        type: "boolean",
    } satisfies Type.Boolean;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
