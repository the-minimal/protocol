export type State = {
	offset: number;
	buffer: ArrayBuffer;
	view: DataView;
	index: number;
	chunks: number;
};

export type Settings = {
	DEFAULT_POOL_SIZE: number;
	MAX_POOL_SIZE: number;
	DEFAULT_CHUNK_SIZE: number;
};
