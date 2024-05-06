import {fc, test} from "@fast-check/vitest";
import {beforeEach, expect} from "vitest";
import {decode, encode, init, Name} from "../src/index.js";

beforeEach(() => init());

test.prop([fc.oneof(fc.constant("ADMIN"), fc.constant("USER"))])("enum", (value) => {
    const type = {
        name: Name.Enum,
        value: ["ADMIN", "USER"]
    } as const;

    const encoded = encode(type, value as "ADMIN" | "USER");
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
