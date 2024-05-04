import { SETTINGS } from "./constants";
import type { State } from "./types";

const FREE: State[] = [];

export const alloc = (): State => {
	if (FREE.length) {
		return FREE.pop() as State;
	}

	const buffer = new ArrayBuffer(SETTINGS.DEFAULT_SIZE, {
		maxByteLength: SETTINGS.MAX_SIZE,
	});

	return {
		buffer,
		view: new DataView(buffer),
		offset: 0,
	};
};

export const free = (state: State) => {
	if (FREE.length < SETTINGS.MAX_BUFFERS) {
		state.buffer.resize(SETTINGS.DEFAULT_SIZE);
		state.offset = 0;

		FREE.push(state);
	}
};

export const check = (state: State, size: number) => {
	if (state.offset + size > SETTINGS.DEFAULT_SIZE) {
		state.buffer.resize(state.buffer.byteLength * 2);
	}
};
