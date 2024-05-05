import {describe, expect} from "vitest";
import {test} from "@fast-check/vitest";
import {estimate, Kind, Name, Settings} from "../src";

const SETTINGS = {
    MAX_POOL_SIZE: 256,
    DEFAULT_POOL_SIZE: 16,
    DEFAULT_CHUNK_SIZE: 8,
} satisfies Settings;

describe("estimate", () => {
    test("boolean", () => {
        expect(estimate({ name: Name.Boolean }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("int", () => {
        expect(estimate({ name: Name.Int, size: 1 }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ name: Name.Int, size: 2 }, SETTINGS)).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ name: Name.Int, size: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });
    });

    test("float", () => {
        expect(estimate({ name: Name.Float, size: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ name: Name.Float, size: 8 }, SETTINGS)).toEqual({
            bytes: 8,
            chunks: 1
        });
    });


    test("string", () => {
        expect(estimate({ name: Name.String, kind: Kind.Ascii, size: 1 }, SETTINGS)).toEqual({
            bytes: 257,
            chunks: 33
        });

        expect(estimate({ name: Name.String, kind: Kind.Ascii, size: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 17,
            chunks: 3
        });

        expect(estimate({ name: Name.String, kind: Kind.Utf8, size: 1 }, SETTINGS)).toEqual({
            bytes: 769,
            chunks: 97
        });

        expect(estimate({ name: Name.String, kind: Kind.Utf8, size: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 49,
            chunks: 7
        });
    });


    test("object", () => {
        expect(estimate({
            name: Name.Object,
            value: [
                {key: "email", name: Name.String},
                {key: "age", name: Name.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            name: Name.Object,
            value: [
                {key: "email", name: Name.String, maxLength: 64 },
                {key: "age", name: Name.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 66,
            chunks: 9
        });
    });

    test("array", () => {
        expect(estimate({
            name: Name.Array,
            value: {name: Name.String},
        }, SETTINGS)).toEqual({
            bytes: 65793,
            chunks: 8225
        });

        expect(estimate({
            name: Name.Array,
            value: {name: Name.String},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 4113,
            chunks: 515
        });

        expect(estimate({
            name: Name.Array,
            value: {name: Name.String, maxLength: 16},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 273,
            chunks: 35
        });
    });

    test("enum", () => {
        expect(estimate({ name: Name.Enum, value: ["ADMIN", "USER"] }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("tuple", () => {
        expect(estimate({
            name: Name.Tuple,
            value: [
                {name: Name.String},
                {name: Name.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            name: Name.Tuple,
            value: [
                {name: Name.String, maxLength: 16},
                {name: Name.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 18,
            chunks: 3
        });
    });
});
