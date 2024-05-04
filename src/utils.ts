import type { Settings, State } from "./types";

export const SETTINGS = {
	DEFAULT_POOL_SIZE: 500_000,
	MAX_POOL_SIZE: 5_000_000,
	DEFAULT_CHUNK_SIZE: 8_000,
};

let MAIN_BUFFER: ArrayBuffer;
let ALLOCATED_BUFFER: ArrayBuffer;
let ALLOCATED_ARRAY: Uint8Array;
let FREE_CHUNKS: number;

export const init = (settings: Partial<Settings> = {}) => {
	Object.assign(SETTINGS, settings);

	MAIN_BUFFER = new ArrayBuffer(SETTINGS.DEFAULT_POOL_SIZE, {
		maxByteLength: SETTINGS.MAX_POOL_SIZE,
	});

	ALLOCATED_BUFFER = new ArrayBuffer(
		SETTINGS.DEFAULT_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE,
		{ maxByteLength: SETTINGS.MAX_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE },
	);

	ALLOCATED_ARRAY = new Uint8Array(ALLOCATED_BUFFER);

	FREE_CHUNKS = SETTINGS.DEFAULT_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE;
};

export const alloc = (chunks: number): State => {
	if (FREE_CHUNKS < chunks) {
		grow();
	}

	let index = 0;
	let counter = 0;

	for (let i = 0; i < ALLOCATED_ARRAY.length; ++i) {
		if (ALLOCATED_ARRAY[i] === 0) {
			counter++;
		} else {
			counter = 0;
		}

		if (counter === chunks) {
			index = i;
			break;
		}
	}

	for (let i = 0; i < chunks; ++i) {
		ALLOCATED_ARRAY[index + i] = 1;
	}

	const buffer = MAIN_BUFFER.slice(
		index * SETTINGS.DEFAULT_CHUNK_SIZE,
		index * SETTINGS.DEFAULT_CHUNK_SIZE + chunks * SETTINGS.DEFAULT_CHUNK_SIZE,
	);

	return {
		index,
		chunks,
		buffer,
		view: new DataView(buffer),
		offset: 0,
	};
};

export const free = (state: State) => {
	for (let i = 0; i < state.chunks; ++i) {
		ALLOCATED_ARRAY[state.index + i] = 0;
	}
};

export const grow = () => {
	MAIN_BUFFER.resize(MAIN_BUFFER.byteLength * 2);
	ALLOCATED_BUFFER.resize(ALLOCATED_BUFFER.byteLength * 2);
	FREE_CHUNKS = ALLOCATED_BUFFER.byteLength * 2 - FREE_CHUNKS;
};
