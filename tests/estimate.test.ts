import {describe, expect} from "vitest";
import {test} from "@fast-check/vitest";
import { estimate } from "../src/estimate.js";
import { Array8, Ascii16, Ascii8, Bool, Enum, Float32, Float64, NArray8, NAscii16, NAscii8, NBool, NEnum, NFloat32, NFloat64, NStruct, NTuple, NUInt16, NUInt32, NUInt8, NUnicode16, NUnicode8, Struct, Tuple, UInt16, UInt32, UInt8, Unicode16, Unicode8 } from "../src/types.js";

describe("estimate", () => {
    test("boolean", () => {
        expect(estimate({ type: Bool })).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ type: NBool })).toEqual({
            bytes: 2,
            chunks: 1
        });
    });

    test("int", () => {
        expect(estimate({ type: UInt8 })).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ type: NUInt8 })).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ type: UInt16 })).toEqual({
            bytes: 2,
            chunks: 1
        });

        expect(estimate({ type: NUInt16 })).toEqual({
            bytes: 3,
            chunks: 1
        });

        expect(estimate({ type: UInt32 })).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ type: NUInt32 })).toEqual({
            bytes: 5,
            chunks: 1
        });
    });

    test("float", () => {
        expect(estimate({ type: Float32 })).toEqual({
            bytes: 4,
            chunks: 1
        });

        expect(estimate({ type: NFloat32 })).toEqual({
            bytes: 5,
            chunks: 1
        });

        expect(estimate({ type: Float64 })).toEqual({
            bytes: 8,
            chunks: 1
        });

        expect(estimate({ type: NFloat64 })).toEqual({
            bytes: 9,
            chunks: 1
        });
    });

    test("ascii", () => {
        expect(estimate({ type: Ascii8 })).toEqual({
            bytes: 257,
            chunks: 1
        });

        expect(estimate({ type: Ascii8, maxLength: 8 })).toEqual({
            bytes: 9,
            chunks: 1
        });

        expect(estimate({ type: NAscii8 })).toEqual({
            bytes: 258,
            chunks: 1
        });

        expect(estimate({ type: NAscii8, maxLength: 8 })).toEqual({
            bytes: 10,
            chunks: 1
        });

        expect(estimate({ type: Ascii16 })).toEqual({
            bytes: 65_538,
            chunks: 9
        });

        expect(estimate({ type: Ascii16, maxLength: 8 })).toEqual({
            bytes: 10,
            chunks: 1
        });

        expect(estimate({ type: NAscii16 })).toEqual({
            bytes: 65_539,
            chunks: 9
        });

        expect(estimate({ type: NAscii16, maxLength: 8 })).toEqual({
            bytes: 11,
            chunks: 1
        });
    });

    test("unicode", () => {
        expect(estimate({ type: Unicode8 })).toEqual({
            bytes: 769,
            chunks: 1
        });

        expect(estimate({ type: Unicode8, maxLength: 8 })).toEqual({
            bytes: 25,
            chunks: 1
        });

        expect(estimate({ type: NUnicode8 })).toEqual({
            bytes: 770,
            chunks: 1
        });

        expect(estimate({ type: NUnicode8, maxLength: 8 })).toEqual({
            bytes: 26,
            chunks: 1
        });

        expect(estimate({ type: Unicode16 })).toEqual({
            bytes: 196_610,
            chunks: 25
        });

        expect(estimate({ type: Unicode16, maxLength: 8 })).toEqual({
            bytes: 26,
            chunks: 1
        });

        expect(estimate({ type: NUnicode16 })).toEqual({
            bytes: 196_611,
            chunks: 25
        });

        expect(estimate({ type: NUnicode16, maxLength: 8 })).toEqual({
            bytes: 27,
            chunks: 1
        });
    });

    test("object", () => {
        expect(estimate({
            type: Struct,
            value: [
                {key: "email", type: Ascii8},
                {key: "age", type: UInt8},
            ]
        })).toEqual({
            bytes: 258,
            chunks: 1
        });

        expect(estimate({
            type: NStruct,
            value: [
                {key: "email", type: Ascii8},
                {key: "age", type: UInt8},
            ]
        })).toEqual({
            bytes: 259,
            chunks: 1
        });
    });

    test("array", () => {
        expect(estimate({
            type: Array8,
            value: {type: Ascii8},
        })).toEqual({
            bytes: 65793,
            chunks: 9
        });

        expect(estimate({
            type: Array8,
            value: {type: Ascii8},
            maxLength: 8
        })).toEqual({
            bytes: 2057,
            chunks: 1
        });

        expect(estimate({
            type: NArray8,
            value: {type: Ascii8},
        })).toEqual({
            bytes: 65794,
            chunks: 9
        });

        expect(estimate({
            type: NArray8,
            value: {type: Ascii8},
            maxLength: 8
        })).toEqual({
            bytes: 2058,
            chunks: 1
        });
    });

    test("enum", () => {
        expect(estimate({ type: Enum, value: ["ADMIN", "USER"] })).toEqual({
            bytes: 1,
            chunks: 1
        });

        expect(estimate({ type: NEnum, value: ["ADMIN", "USER"] })).toEqual({
            bytes: 2,
            chunks: 1
        });
    });

    test("tuple", () => {
        expect(estimate({
            type: Tuple,
            value: [
                {type: Ascii8},
                {type: UInt8},
            ]
        })).toEqual({
            bytes: 258,
            chunks: 1
        });

        expect(estimate({
            type: NTuple,
            value: [
                {type: Ascii8},
                {type: UInt8},
            ]
        })).toEqual({
            bytes: 259,
            chunks: 1
        });
    });
});
