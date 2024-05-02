import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import {decode, encode, Protocol} from "../src";

test.prop([fc.oneof(fc.constant("ADMIN"), fc.constant("USER"))])("enum", (value) => {
    const type = {
        type: "enum",
        options: ["ADMIN", "USER"]
    } satisfies Protocol.Enum;

    const encoded = encode(type, value);
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
