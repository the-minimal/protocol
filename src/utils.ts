import { SETTINGS } from "./constants";
import type { State } from "./types";

const BUFFER = new ArrayBuffer(SETTINGS.DEFAULT_POOL_SIZE, {
	maxByteLength: SETTINGS.MAX_POOL_SIZE,
});

const ALLOCATED_BUFFER = new ArrayBuffer(
	SETTINGS.DEFAULT_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE,
	{ maxByteLength: SETTINGS.MAX_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE },
);

const ALLOCATED_ARRAY = new Uint8Array(ALLOCATED_BUFFER);

let FREE_CHUNKS = SETTINGS.DEFAULT_POOL_SIZE / SETTINGS.DEFAULT_CHUNK_SIZE;

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

	const buffer = BUFFER.slice(
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
	BUFFER.resize(BUFFER.byteLength * 2);
	ALLOCATED_BUFFER.resize(ALLOCATED_BUFFER.byteLength * 2);
	FREE_CHUNKS = ALLOCATED_BUFFER.byteLength * 2 - FREE_CHUNKS;
};
