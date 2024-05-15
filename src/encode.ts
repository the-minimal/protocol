import { error } from "@the-minimal/error";
import type {
	AnyProtocolType,
	EncodeState,
	Encoders,
	Infer,
	Protocol,
} from "./types/index.js";
import { alloc, free } from "./utils.js";

const encoder = new TextEncoder();

const EncodeError = error("EncodeError");

const TYPES = [
	// Boolean
	(state: EncodeState, _: Protocol.Boolean, value: boolean) => {
		state.view.setUint8(state.offset++, +value);
	},
	// Uint
	(state: EncodeState, type: Protocol.UInt, value: number) => {
		state.view[`setUint${((type.type - 10) * 8) as 8 | 16 | 32}`](
			state.offset,
			value,
		);

		state.offset += type.type - 10;
	},
	// Int
	(state: EncodeState, type: Protocol.Int, value: number) => {
		state.view[`setInt${((type.type - 20) * 8) as 8 | 16 | 32}`](
			state.offset,
			value,
		);
		state.offset += type.type - 20;
	},
	// Float
	(state: EncodeState, type: Protocol.Float, value: number) => {
		state.view[`setFloat${((type.type - 30) * 8) as 32 | 64}`](
			state.offset,
			value,
		);
		state.offset += type.type - 30;
	},
	// Ascii
	(state: EncodeState, type: Protocol.Ascii, value: string) => {
		state.view[`setUint${((type.type - 40) * 8) as 8 | 16}`](
			state.offset,
			value.length,
		);

		state.offset += type.type - 40;

		for (let i = 0; i < value.length; ++i) {
			state.view.setUint8(state.offset++, value.charCodeAt(i));
		}
	},
	// Unicode
	(state: EncodeState, type: Protocol.Unicode, value: string) => {
		const written = encoder.encodeInto(
			value,
			new Uint8Array(state.buffer, state.offset + (type.type - 50)),
		).written;

		state.view[`setUint${((type.type - 50) * 8) as 8 | 16}`](
			state.offset,
			written,
		);
		state.offset += type.type - 50 + written;
	},
	// Object
	(
		state: EncodeState,
		type: Protocol.Object,
		value: Record<string, unknown>,
	) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[type.value[i].key]);
		}
	},
	// Array
	(state: EncodeState, type: Protocol.Array, value: unknown[]) => {
		state.view[`setUint${((type.type - 70) * 8) as 8 | 16}`](
			state.offset,
			value.length,
		);

		state.offset += type.type - 70;

		for (let i = 0; i < value.length; ++i) {
			run(state, type.value, value[i]);
		}
	},
	// Enum
	(state: EncodeState, type: Protocol.Enum, value: unknown) => {
		state.view.setUint8(state.offset++, type.value.indexOf(value));
	},
	// Tuple
	(state: EncodeState, type: Protocol.Tuple, value: unknown[]) => {
		for (let i = 0; i < type.value.length; ++i) {
			run(state, type.value[i], value[i]);
		}
	},
] satisfies Encoders;

const run = (state: EncodeState, type: AnyProtocolType, value: unknown) => {
	// TODO: get rid of this heresy
	const typeCopy = { ...type };

	if (((typeCopy.type - 100) >>> 31) ^ 1) {
		typeCopy.type -= 100;
		state.view.setUint8(state.offset++, +(value === null));

		if (value === null) {
			state.view.setUint8(state.offset++, 0);

			return;
		}
	}

	typeCopy.assert?.(value);

	(TYPES[(typeCopy.type / 10) | 0] as any)(state, typeCopy, value);
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
