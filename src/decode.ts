import { error } from "@the-minimal/error";
import type {
	AnyProtocolType,
	DecodeState,
	Decoders,
	Infer,
	Protocol,
} from "./types/index.js";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const TYPES = [
	// Boolean
	(state) => {
		return state.view.getUint8(state.offset) === 1;
	},
	// UInt
	(state, _, index) => {
		const result = state.view[`getUint${((index - 10) * 8) as 8 | 16 | 32}`](
			state.offset,
		);

		state.offset += index - 10;

		return result;
	},
	// Int
	(state, _, index) => {
		const result = state.view[`getInt${((index - 20) * 8) as 8 | 16 | 32}`](
			state.offset,
		);

		state.offset += index - 20;

		return result;
	},
	// Float
	(state, _, index) => {
		const result = state.view[`getFloat${((index - 30) * 8) as 32 | 64}`](
			state.offset,
		);

		state.offset += index - 30;

		return result;
	},
	// Ascii
	(state, _, index) => {
		const length = state.view[`getUint${((index - 40) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += index - 40;

		const result = ascii.decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	// Unicode
	(state, _, index) => {
		const length = state.view[`getUint${((index - 50) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += index - 50;

		const result = utf8.decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	// Object
	(state, type) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	// Array
	(state, type, index) => {
		const length = state.view[`getUint${((index - 70) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += index - 70;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(state, type.value);
		}

		return result;
	},
	// Enum
	(state, type) => {
		return type.value[state.view.getUint8(state.offset++)];
	},
	// Tuple
	(state, type) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
] satisfies Decoders;

const run = (state: DecodeState, type: AnyProtocolType) => {
	let index = type.type;

	if (((index - 100) >>> 31) ^ 1) {
		index -= 100;

		if (state.view.getUint8(state.offset++) === 1) {
			state.offset++;
			return null;
		}
	}

	const result = (TYPES[(index / 10) | 0] as any)(state, type, index);

	type.assert?.(result);

	return result;
};

export const decode = (<$Type extends AnyProtocolType>(
	type: $Type,
	buffer: ArrayBuffer,
) => {
	try {
		return run(
			{
				buffer,
				view: new DataView(buffer),
				offset: 0,
			},
			type,
		) as Infer<$Type>;
	} catch (e: any) {
		DecodeError(e, e?.message);
	}
}) as <$Type extends AnyProtocolType>(
	type: $Type,
	buffer: ArrayBuffer,
) => Infer<$Type>;
