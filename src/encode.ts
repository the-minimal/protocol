import { error } from "@the-minimal/error";
import type {
	AnyProtocolType,
	EncodeState,
	Encoders,
	Infer,
} from "./types/index.js";
import { alloc, free } from "./utils.js";

const encoder = new TextEncoder();

const EncodeError = error("EncodeError");

const TYPES = [
	// Boolean
	(state, _1, _2, value) => {
		state.view.setUint8(state.offset++, +value);
	},
	// Uint
	(state, _, index, value) => {
		state.view[`setUint${((index - 10) * 8) as 8 | 16 | 32}`](
			state.offset,
			value,
		);

		state.offset += index - 10;
	},
	// Int
	(state, _, index, value) => {
		state.view[`setInt${((index - 20) * 8) as 8 | 16 | 32}`](
			state.offset,
			value,
		);
		state.offset += index - 20;
	},
	// Float
	(state, _, index, value) => {
		state.view[`setFloat${((index - 30) * 8) as 32 | 64}`](state.offset, value);
		state.offset += index - 30;
	},
	// Ascii
	(state, _, index, value) => {
		state.view[`setUint${((index - 40) * 8) as 8 | 16}`](
			state.offset,
			value.length,
		);

		state.offset += index - 40;

		for (let i = 0; i < value.length; ++i) {
			state.view.setUint8(state.offset++, value.charCodeAt(i));
		}
	},
	// Unicode
	(state, _, index, value) => {
		const written = encoder.encodeInto(
			value,
			new Uint8Array(state.buffer, state.offset + (index - 50)),
		).written;

		state.view[`setUint${((index - 50) * 8) as 8 | 16}`](state.offset, written);
		state.offset += index - 50 + written;
	},
	// Object
	(state, type, _, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[type.value[i].key]);
		}
	},
	// Array
	(state, type, index, value) => {
		state.view[`setUint${((index - 70) * 8) as 8 | 16}`](
			state.offset,
			value.length,
		);

		state.offset += index - 70;

		for (let i = 0; i < value.length; ++i) {
			run(state, type.value, value[i]);
		}
	},
	// Enum
	(state, type, _, value) => {
		state.view.setUint8(state.offset++, type.value.indexOf(value));
	},
	// Tuple
	(state, type, _, value) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[i]);
		}
	},
] satisfies Encoders;

const run = (state: EncodeState, type: AnyProtocolType, value: unknown) => {
	let index = type.type;

	if (((index - 100) >>> 31) ^ 1) {
		index -= 100;

		state.view.setUint8(state.offset++, +(value === null));

		if (value === null) {
			state.view.setUint8(state.offset++, 0);

			return;
		}
	}

	type.assert?.(value);

	(TYPES[(index / 10) | 0] as any)(state, type, index, value);
};

export const encode = (<const $Type extends AnyProtocolType>(
	type: $Type,
	value: Infer<$Type>,
	chunks = 1,
) => {
	try {
		const state = alloc(chunks);

		run(state, type, value);

		const result = state.buffer.slice(0, state.offset);

		free(state);

		return result;
	} catch (e: any) {
		EncodeError(e, e?.message);
	}
}) as <const $Type extends AnyProtocolType>(
	type: $Type,
	value: Infer<$Type>,
	chunks?: number,
) => ArrayBuffer;
