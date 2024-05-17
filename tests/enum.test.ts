import {fc, test} from "@fast-check/vitest";
import {expect} from "vitest";
import { Enum } from "../src/types.js";
import { encode } from "../src/encode.js";
import { decode } from "../src/decode.js";

test.prop([fc.oneof(fc.constant("ADMIN"), fc.constant("USER"))])("enum", (value) => {
    const type = {
        type: Enum,
        value: ["ADMIN", "USER"]
    } as const;

    const encoded = encode(type, value as "ADMIN" | "USER");
    const decoded = decode(type, encoded);

    expect(decoded).toEqual(value);
});
