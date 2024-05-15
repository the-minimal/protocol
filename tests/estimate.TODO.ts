import {describe, expect} from "vitest";
import {test} from "@fast-check/vitest";
import {estimate, Kind, Type, Settings, Key} from "../src/index.js";

const SETTINGS = {
    MAX_POOL_SIZE: 256,
    DEFAULT_POOL_SIZE: 16,
    DEFAULT_CHUNK_SIZE: 8,
} satisfies Settings;

describe("estimate", () => {
    test("boolean", () => {
        expect(estimate({ [Key.Type]: Type.Boolean }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("int", () => {
        expect(estimate({ [Key.Type]: Type.Int, [Key.Size]: 1 }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ [Key.Type]: Type.Int, [Key.Size]: 2 }, SETTINGS)).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ [Key.Type]: Type.Int, [Key.Size]: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });
    });

    test("float", () => {
        expect(estimate({ [Key.Type]: Type.Float, [Key.Size]: 4 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ [Key.Type]: Type.Float, [Key.Size]: 8 }, SETTINGS)).toEqual({
            bytes: 8,
            chunks: 1
        });
    });


    test("string", () => {
        expect(estimate({ [Key.Type]: Type.String, [Key.Kind]: Kind.Ascii, [Key.Size]: 1 }, SETTINGS)).toEqual({
            bytes: 257,
            chunks: 33
        });

        expect(estimate({ [Key.Type]: Type.String, [Key.Kind]: Kind.Ascii, [Key.Size]: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 17,
            chunks: 3
        });

        expect(estimate({ [Key.Type]: Type.String, [Key.Kind]: Kind.Utf8, [Key.Size]: 1 }, SETTINGS)).toEqual({
            bytes: 769,
            chunks: 97
        });

        expect(estimate({ [Key.Type]: Type.String, [Key.Kind]: Kind.Utf8, [Key.Size]: 1, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 49,
            chunks: 7
        });
    });


    test("object", () => {
        expect(estimate({
            [Key.Type]: Type.Object,
            [Key.Value]: [
                {[Key.Key]: "email", [Key.Type]: Type.String},
                {[Key.Key]: "age", [Key.Type]: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            [Key.Type]: Type.Object,
            [Key.Value]: [
                {[Key.Key]: "email", [Key.Type]: Type.String, maxLength: 64 },
                {[Key.Key]: "age", [Key.Type]: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 66,
            chunks: 9
        });
    });

    test("array", () => {
        expect(estimate({
            [Key.Type]: Type.Array,
            [Key.Value]: {[Key.Type]: Type.String},
        }, SETTINGS)).toEqual({
            bytes: 65793,
            chunks: 8225
        });

        expect(estimate({
            [Key.Type]: Type.Array,
            [Key.Value]: {[Key.Type]: Type.String},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 4113,
            chunks: 515
        });

        expect(estimate({
            [Key.Type]: Type.Array,
            [Key.Value]: {[Key.Type]: Type.String, maxLength: 16},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 273,
            chunks: 35
        });
    });

    test("enum", () => {
        expect(estimate({ [Key.Type]: Type.Enum, [Key.Value]: ["ADMIN", "USER"] }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("tuple", () => {
        expect(estimate({
            [Key.Type]: Type.Tuple,
            [Key.Value]: [
                {[Key.Type]: Type.String},
                {[Key.Type]: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            [Key.Type]: Type.Tuple,
            [Key.Value]: [
                {[Key.Type]: Type.String, maxLength: 16},
                {[Key.Type]: Type.Int},
            ]
        }, SETTINGS)).toEqual({
            bytes: 18,
            chunks: 3
        });
    });
});
