import {describe, expect} from "vitest";
import {test} from "@fast-check/vitest";
import {estimate, Settings} from "../src";

const SETTINGS = {
    MAX_POOL_SIZE: 256,
    DEFAULT_POOL_SIZE: 16,
    DEFAULT_CHUNK_SIZE: 8,
} satisfies Settings;

describe("estimate", () => {
    test("boolean", () => {
        expect(estimate({ type: "boolean" }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("int", () => {
        expect(estimate({ type: "int", size: 8 }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ type: "int", size: 16 }, SETTINGS)).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ type: "int", size: 32 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });
    });

    test("float", () => {
        expect(estimate({ type: "float", size: 32 }, SETTINGS)).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ type: "float", size: 64 }, SETTINGS)).toEqual({
            bytes: 8,
            chunks: 1
        });
    });


    test("string", () => {
        expect(estimate({ type: "string", kind: "ascii", size: 8 }, SETTINGS)).toEqual({
            bytes: 257,
            chunks: 33
        });

        expect(estimate({ type: "string", kind: "ascii", size: 8, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 17,
            chunks: 3
        });

        expect(estimate({ type: "string", kind: "utf8", size: 8 }, SETTINGS)).toEqual({
            bytes: 769,
            chunks: 97
        });

        expect(estimate({ type: "string", kind: "utf8", size: 8, maxLength: 16 }, SETTINGS)).toEqual({
            bytes: 49,
            chunks: 7
        });
    });


    test("object", () => {
        expect(estimate({
            type: "object",
            value: [
                {key: "email", type: "string"},
                {key: "age", type: "int"},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            type: "object",
            value: [
                {key: "email", type: "string", maxLength: 64 },
                {key: "age", type: "int"},
            ]
        }, SETTINGS)).toEqual({
            bytes: 66,
            chunks: 9
        });
    });

    test("array", () => {
        expect(estimate({
            type: "array",
            value: {type: "string"},
        }, SETTINGS)).toEqual({
            bytes: 65793,
            chunks: 8225
        });

        expect(estimate({
            type: "array",
            value: {type: "string"},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 4113,
            chunks: 515
        });

        expect(estimate({
            type: "array",
            value: {type: "string", maxLength: 16},
            maxLength: 16
        }, SETTINGS)).toEqual({
            bytes: 273,
            chunks: 35
        });
    });

    test("enum", () => {
        expect(estimate({ type: "enum", value: ["ADMIN", "USER"] }, SETTINGS)).toEqual({
            bytes: 1,
            chunks: 1
        });
    });

    test("tuple", () => {
        expect(estimate({
            type: "tuple",
            value: [
                {type: "string"},
                {type: "int"},
            ]
        }, SETTINGS)).toEqual({
            bytes: 258,
            chunks: 33
        });

        expect(estimate({
            type: "tuple",
            value: [
                {type: "string", maxLength: 16},
                {type: "int"},
            ]
        }, SETTINGS)).toEqual({
            bytes: 18,
            chunks: 3
        });
    });
});
