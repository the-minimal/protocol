import { error } from "@the-minimal/error";
import type {
	AnyProtocolType,
	Decoders,
	Infer,
	Protocol,
	State,
} from "./types/index.js";

const utf8 = new TextDecoder("utf-8");
const ascii = new TextDecoder("ascii");

const DecodeError = error("DecodeError");

const TYPES = [
	// Boolean
	(state: State) => {
		return state.view.getUint8(state.offset) === 1;
	},
	// UInt
	(state: State, type: Protocol.UInt) => {
		const result = state.view[
			`getUint${((type.type - 10) * 8) as 8 | 16 | 32}`
		](state.offset);

		state.offset += type.type - 10;

		return result;
	},
	// Int
	(state: State, type: Protocol.Int) => {
		const result = state.view[`getInt${((type.type - 20) * 8) as 8 | 16 | 32}`](
			state.offset,
		);

		state.offset += type.type - 20;

		return result;
	},
	// Float
	(state: State, type: Protocol.Float) => {
		const result = state.view[`getFloat${((type.type - 30) * 8) as 32 | 64}`](
			state.offset,
		);

		state.offset += type.type - 30;

		return result;
	},
	// Ascii
	(state: State, type: Protocol.Ascii) => {
		const length = state.view[`getUint${((type.type - 40) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += type.type - 40;

		const result = ascii.decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	// Unicode
	(state: State, type: Protocol.Unicode) => {
		const length = state.view[`getUint${((type.type - 50) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += type.type - 50;

		const result = utf8.decode(
			new Uint8Array(state.buffer, state.offset, length),
		);

		state.offset += length;

		return result;
	},
	// Object
	(state: State, type: Protocol.Object) => {
		const result: Record<string, unknown> = {};

		for (let i = 0; i < type.value.length; ++i) {
			result[type.value[i].key] = run(state, type.value[i]);
		}

		return result;
	},
	// Array
	(state: State, type: Protocol.Array) => {
		const length = state.view[`getUint${((type.type - 70) * 8) as 8 | 16}`](
			state.offset,
		);

		state.offset += type.type - 70;

		const result: unknown[] = [];

		for (let i = 0; i < length; ++i) {
			result[i] = run(state, type.value);
		}

		return result;
	},
	// Enum
	(state: State, type: Protocol.Enum) => {
		return type.value[state.view.getUint8(state.offset++)];
	},
	// Tuple
	(state: State, type: Protocol.Tuple) => {
		const result: unknown[] = [];

		for (let i = 0; i < type.value.length; ++i) {
			result[i] = run(state, type.value[i]);
		}

		return result;
	},
] satisfies Decoders;

const run = (state: State, type: AnyProtocolType) => {
	// TODO: get rid of this heresy
	const typeCopy = { ...type };

	if (((typeCopy.type - 100) >>> 31) ^ 1) {
		typeCopy.type -= 100;

		if (state.view.getUint8(state.offset++) === 1) {
			state.offset++;
			return null;
		}
	}

	const result = (TYPES[(typeCopy.type / 10) | 0] as any)(state, typeCopy);

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
				offset: 0,
				buffer,
				view: new DataView(buffer),
				index: 0,
				chunks: 0,
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
