import {describe, expect} from "vitest";
import {test} from "@fast-check/vitest";
import {estimate, Kind, Type, Settings} from "../src/index.js";

const SETTINGS = {
    MAX_POOL_SIZE: 256,
    DEFAULT_POOL_SIZE: 16,
    DEFAULT_CHUNK_SIZE: 8,
} satisfies Settings;

describe("estimate", () => {
    test("boolean", () => {
        expect(estimate({ type: Type.Boolean }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("int", () => {
        expect(estimate({ type: Type.Int, size: 1 }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ type: Type.Int, size: 2 }, SETTINGS)).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ type: Type.Int, size: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });
    });

    test("float", () => {
        expect(estimate({ type: Type.Float, size: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ type: Type.Float, size: 8 }, SETTINGS)).toEqual({
            bytes: 8,
            chunks: 1
        });
    });


    test("string", () => {
        expect(estimate({ type: Type.String, kind: Kind.Ascii, size: 1 }, SETTINGS)).toEqual({
            bytes: 257,
            chunks: 33
        });

        expect(estimate({ type: Type.String, kind: Kind.Ascii, size: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 17,
            chunks: 3
        });

        expect(estimate({ type: Type.String, kind: Kind.Utf8, size: 1 }, SETTINGS)).toEqual({
            bytes: 769,
            chunks: 97
        });

        expect(estimate({ type: Type.String, kind: Kind.Utf8, size: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 49,
            chunks: 7
        });
    });


    test("object", () => {
        expect(estimate({
            type: Type.Object,
            value: [
                {key: "email", type: Type.String},
                {key: "age", type: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            type: Type.Object,
            value: [
                {key: "email", type: Type.String, maxLength: 64 },
                {key: "age", type: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 66,
            chunks: 9
        });
    });

    test("array", () => {
        expect(estimate({
            type: Type.Array,
            value: {type: Type.String},
        }, SETTINGS)).toEqual({
            bytes: 65793,
            chunks: 8225
        });

        expect(estimate({
            type: Type.Array,
            value: {type: Type.String},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 4113,
            chunks: 515
        });

        expect(estimate({
            type: Type.Array,
            value: {type: Type.String, maxLength: 16},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 273,
            chunks: 35
        });
    });

    test("enum", () => {
        expect(estimate({ type: Type.Enum, value: ["ADMIN", "USER"] }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("tuple", () => {
        expect(estimate({
            type: Type.Tuple,
            value: [
                {type: Type.String},
                {type: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            type: Type.Tuple,
            value: [
                {type: Type.String, maxLength: 16},
                {type: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 18,
            chunks: 3
        });
    });
});
