import { fc, test } from "@fast-check/vitest";
import { expect, vi } from "vitest";
import {
	decodeArray8,
	decodeArray16,
	decodeAscii8,
	decodeAscii16,
	decodeEnum,
	decodeFloat32,
	decodeFloat64,
	decodeInt8,
	decodeInt16,
	decodeInt32,
	decodeNullable,
	decodeObject,
	decodeTap,
	decodeTuple,
	decodeUint8,
	decodeUint16,
	decodeUint32,
	decodeUnicode8,
	decodeUnicode16,
	encodeArray8,
	encodeArray16,
	encodeAscii8,
	encodeAscii16,
	encodeEnum,
	encodeFloat32,
	encodeFloat64,
	encodeInt8,
	encodeInt16,
	encodeInt32,
	encodeNullable,
	encodeObject,
	encodeTap,
	encodeTuple,
	encodeUint8,
	encodeUint16,
	encodeUint32,
	encodeUnicode8,
	encodeUnicode16,
} from "./methods/index.js";

const TESTS = {
	Uint8: {
		encode: encodeUint8,
		decode: decodeUint8,
		prop: fc.integer({ min: 0, max: 255 }),
	},
	Uint16: {
		encode: encodeUint16,
		decode: decodeUint16,
		prop: fc.integer({ min: 0, max: 65_535 }),
	},
	Uint32: {
		encode: encodeUint32,
		decode: decodeUint32,
		prop: fc.integer({ min: 0, max: 4_294_967_295 }),
	},
	Int8: {
		encode: encodeInt8,
		decode: decodeInt8,
		prop: fc.integer({ min: -128, max: 127 }),
	},
	Int16: {
		encode: encodeInt16,
		decode: decodeInt16,
		prop: fc.integer({ min: -32_768, max: 32_767 }),
	},
	Int32: {
		encode: encodeInt32,
		decode: decodeInt32,
		prop: fc.integer({ min: -2_147_483_648, max: 2_147_483_647 }),
	},
	Float32: {
		encode: encodeFloat32,
		decode: decodeFloat32,
		prop: fc.float(),
	},
	Float64: {
		encode: encodeFloat64,
		decode: decodeFloat64,
		prop: fc.double(),
	},
	Ascii8: {
		encode: encodeAscii8,
		decode: decodeAscii8,
		prop: fc.asciiString({ maxLength: 255 }),
	},
	Ascii16: {
		encode: encodeAscii16,
		decode: decodeAscii16,
		prop: fc.asciiString({ maxLength: 65_535 }),
	},
	Unicode8: {
		encode: encodeUnicode8,
		decode: decodeUnicode8,
		prop: fc.unicodeString({ maxLength: 255 }),
	},
	Unicode16: {
		encode: encodeUnicode16,
		decode: decodeUnicode16,
		prop: fc.unicodeString({ maxLength: 65_535 }),
	},
	Object: {
		encode: encodeObject([
			{ key: "email", type: encodeAscii8 },
			{ key: "password", type: encodeAscii8 },
		]),
		decode: decodeObject([
			{ key: "email", type: decodeAscii8 },
			{ key: "password", type: decodeAscii8 },
		]),
		prop: fc.record({
			email: fc.asciiString({ maxLength: 255 }),
			password: fc.asciiString({ maxLength: 255 }),
		}),
		compare: "toEqual",
	},
	Array8: {
		encode: encodeArray8(encodeUint8),
		decode: decodeArray8(decodeUint8),
		prop: fc.array(fc.integer({ min: 0, max: 255 }), { maxLength: 255 }),
		compare: "toEqual",
	},
	Array16: {
		encode: encodeArray16(encodeUint8),
		decode: decodeArray16(decodeUint8),
		prop: fc.array(fc.integer({ min: 0, max: 255 }), { maxLength: 65_535 }),
		compare: "toEqual",
	},
	Enum: {
		encode: encodeEnum(["ADMIN", "USER"]),
		decode: decodeEnum(["ADMIN", "USER"]),
		prop: fc.oneof(fc.constant("ADMIN"), fc.constant("USER")),
	},
	Tuple: {
		encode: encodeTuple([encodeUint8, encodeAscii8]),
		decode: decodeTuple([decodeUint8, decodeAscii8]),
		prop: fc.tuple(
			fc.integer({ min: 0, max: 255 }),
			fc.asciiString({ maxLength: 255 }),
		),
		compare: "toEqual",
	},
	Nullable: {
		encode: encodeNullable(encodeUint8),
		decode: decodeNullable(decodeUint8),
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

const set = new Set<string>();

for (const name in TESTS) {
	const currentTest = TESTS[name as keyof typeof TESTS];
	const { encode, decode, prop } = currentTest;

	test.prop([prop])(name, (v) => {
		const encodeState = createEncodeState();

		(encode as any)(encodeState, v);

		if (!set.has(name)) {
			console.log(name, v, encodeState.a.buffer);
			set.add(name);
		}

		const decodeState = createDecodeState(encodeState.o);

		const decoded = decode(decodeState);

		(expect(decoded) as any)[(currentTest as any).compare ?? "toBe"](v);
	});
}

test.prop([fc.integer({ min: 0, max: 255 })])("Tap", (v) => {
	const encoderTapFn = vi.fn();
	const decoderTapFn = vi.fn();
	const encode = encodeTap(encodeUint8, encoderTapFn);
	const decode = decodeTap(decodeUint8, decoderTapFn);

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
