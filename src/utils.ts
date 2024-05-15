import type { EncodeState } from "./types/encode.js";

const POOL_SIZE = 128_000;
const CHUNK_SIZE = 8_000;
const LAYOUT_SIZE = POOL_SIZE / CHUNK_SIZE;

let POOL_BUFFER = new Uint8Array(POOL_SIZE);
let POOL_LAYOUT = new Uint8Array(LAYOUT_SIZE);
let FREE_CHUNKS = LAYOUT_SIZE;

export const alloc = (chunks: number): EncodeState => {
	if (FREE_CHUNKS < chunks) {
		refill();
	}

	let count = 0;

	for (let i = 0; i < LAYOUT_SIZE; ++i) {
		if (POOL_LAYOUT[i] === 0) {
			if (count++ === chunks) {
				const layout_start = i - chunks;
				const layout_end = i;
				const offset = layout_start * CHUNK_SIZE;

				POOL_LAYOUT.fill(1, layout_start, layout_end);
				FREE_CHUNKS -= chunks;

				const array = POOL_BUFFER.subarray(offset, layout_end * CHUNK_SIZE);

				return {
					id: POOL_BUFFER,
					buffer: array.buffer,
					array,
					view: new DataView(array.buffer),
					offset,
					layout_start,
					layout_end,
					chunks,
				};
			}
		} else {
			count = 0;
		}
	}

	refill();

	return alloc(chunks);
};

const refill = () => {
	POOL_BUFFER = new Uint8Array(POOL_SIZE);
	POOL_LAYOUT = new Uint8Array(LAYOUT_SIZE);
	FREE_CHUNKS = LAYOUT_SIZE;
};

export const free = (state: EncodeState) => {
	if (POOL_BUFFER === state.id) {
		POOL_LAYOUT.fill(0, state.layout_start, state.layout_end);
		FREE_CHUNKS += state.chunks;
	}
};
