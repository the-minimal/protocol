import { fc, test } from "@fast-check/vitest";
import { expect, vi } from "vitest";
import {
	DecodeArray8,
	DecodeArray16,
	DecodeAscii8,
	DecodeAscii16,
	DecodeEnum,
	DecodeFloat32,
	DecodeFloat64,
	DecodeInt8,
	DecodeInt16,
	DecodeInt32,
	DecodeNullable,
	DecodeObject,
	DecodeTap,
	DecodeTuple,
	DecodeUint8,
	DecodeUint16,
	DecodeUint32,
	DecodeUnicode8,
	DecodeUnicode16,
	EncodeArray8,
	EncodeArray16,
	EncodeAscii8,
	EncodeAscii16,
	EncodeEnum,
	EncodeFloat32,
	EncodeFloat64,
	EncodeInt8,
	EncodeInt16,
	EncodeInt32,
	EncodeNullable,
	EncodeObject,
	EncodeTap,
	EncodeTuple,
	EncodeUint8,
	EncodeUint16,
	EncodeUint32,
	EncodeUnicode8,
	EncodeUnicode16,
} from "./methods/index.js";

const TESTS = {
	Uint8: {
		encode: EncodeUint8,
		decode: DecodeUint8,
		prop: fc.integer({ min: 0, max: 255 }),
	},
	Uint16: {
		encode: EncodeUint16,
		decode: DecodeUint16,
		prop: fc.integer({ min: 0, max: 65_535 }),
	},
	Uint32: {
		encode: EncodeUint32,
		decode: DecodeUint32,
		prop: fc.integer({ min: 0, max: 4_294_967_295 }),
	},
	Int8: {
		encode: EncodeInt8,
		decode: DecodeInt8,
		prop: fc.integer({ min: -128, max: 127 }),
	},
	Int16: {
		encode: EncodeInt16,
		decode: DecodeInt16,
		prop: fc.integer({ min: -32_768, max: 32_767 }),
	},
	Int32: {
		encode: EncodeInt32,
		decode: DecodeInt32,
		prop: fc.integer({ min: -2_147_483_648, max: 2_147_483_647 }),
	},
	Float32: {
		encode: EncodeFloat32,
		decode: DecodeFloat32,
		prop: fc.float(),
	},
	Float64: {
		encode: EncodeFloat64,
		decode: DecodeFloat64,
		prop: fc.double(),
	},
	Ascii8: {
		encode: EncodeAscii8,
		decode: DecodeAscii8,
		prop: fc.asciiString({ maxLength: 255 }),
	},
	Ascii16: {
		encode: EncodeAscii16,
		decode: DecodeAscii16,
		prop: fc.asciiString({ maxLength: 65_535 }),
	},
	Unicode8: {
		encode: EncodeUnicode8,
		decode: DecodeUnicode8,
		prop: fc.unicodeString({ maxLength: 255 }),
	},
	Unicode16: {
		encode: EncodeUnicode16,
		decode: DecodeUnicode16,
		prop: fc.unicodeString({ maxLength: 65_535 }),
	},
	Object: {
		encode: EncodeObject([
			{ key: "email", type: EncodeAscii8 },
			{ key: "password", type: EncodeAscii8 },
		]),
		decode: DecodeObject([
			{ key: "email", type: DecodeAscii8 },
			{ key: "password", type: DecodeAscii8 },
		]),
		prop: fc.record({
			email: fc.asciiString({ maxLength: 255 }),
			password: fc.asciiString({ maxLength: 255 }),
		}),
		compare: "toEqual",
	},
	Array8: {
		encode: EncodeArray8(EncodeUint8),
		decode: DecodeArray8(DecodeUint8),
		prop: fc.array(fc.integer({ min: 0, max: 255 }), { maxLength: 255 }),
		compare: "toEqual",
	},
	Array16: {
		encode: EncodeArray16(EncodeUint8),
		decode: DecodeArray16(DecodeUint8),
		prop: fc.array(fc.integer({ min: 0, max: 255 }), { maxLength: 65_535 }),
		compare: "toEqual",
	},
	Enum: {
		encode: EncodeEnum(["ADMIN", "USER"]),
		decode: DecodeEnum(["ADMIN", "USER"]),
		prop: fc.oneof(fc.constant("ADMIN"), fc.constant("USER")),
	},
	Tuple: {
		encode: EncodeTuple([EncodeUint8, EncodeAscii8]),
		decode: DecodeTuple([DecodeUint8, DecodeAscii8]),
		prop: fc.tuple(
			fc.integer({ min: 0, max: 255 }),
			fc.asciiString({ maxLength: 255 }),
		),
		compare: "toEqual",
	},
	Nullable: {
		encode: EncodeNullable(EncodeUint8),
		decode: DecodeNullable(DecodeUint8),
		prop: fc.oneof(fc.constant(null), fc.integer({ min: 0, max: 255 })),
	},
};

const array = new Uint8Array(128_000);
const view = new DataView(array.buffer);

const createEncodeState = () => ({
	a: array,
	v: view,
	o: 0,
});

const createDecodeState = (offset: number) => ({
	a: array.subarray(0, offset),
	v: new DataView(array.buffer, 0, offset),
	o: 0,
});

for (const name in TESTS) {
	const currentTest = TESTS[name as keyof typeof TESTS];
	const { encode, decode, prop } = currentTest;

	test.prop([prop])(name, (v) => {
		const encodeState = createEncodeState();

		(encode as any)(encodeState, v);

		const decodeState = createDecodeState(encodeState.o);

		const decoded = decode(decodeState);

		(expect(decoded) as any)[(currentTest as any).compare ?? "toBe"](v);
	});
}

test.prop([fc.integer({ min: 0, max: 255 })])("Tap", (v) => {
	const encoderTapFn = vi.fn();
	const decoderTapFn = vi.fn();
	const encode = EncodeTap(EncodeUint8, encoderTapFn);
	const decode = DecodeTap(DecodeUint8, decoderTapFn);

	const encodeState = createEncodeState();

	(encode as any)(encodeState, v);

	expect(encoderTapFn).toHaveBeenCalledOnce();
	expect(encoderTapFn).toHaveBeenCalledWith(v);

	const decodeState = createDecodeState(encodeState.o);

	const decoded = decode(decodeState);

	expect(decoderTapFn).toHaveBeenCalledOnce();
	expect(decoderTapFn).toHaveBeenCalledWith(v);
	expect(decoded).toBe(v);
});
