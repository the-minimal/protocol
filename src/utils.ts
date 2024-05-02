export type Buffer = {
	offset: number;
	buffer: ArrayBuffer;
	view: DataView;
};

const MAX_BUFFERS = 12;
const DEFAULT_SIZE = 1024;
const MAX_SIZE = DEFAULT_SIZE * 128;

const FREE: Buffer[] = [];

export const alloc = (): Buffer => {
	if (FREE.length) {
		return FREE.pop() as Buffer;
	}

	const buffer = new ArrayBuffer(DEFAULT_SIZE, { maxByteLength: MAX_SIZE });

	return {
		buffer,
		view: new DataView(buffer),
		offset: 0,
	};
};

export const free = (buffer: Buffer) => {
	if (FREE.length < MAX_BUFFERS) {
		buffer.buffer.resize(DEFAULT_SIZE);
		buffer.offset = 0;

		FREE.push(buffer);
	}
};

export const check = (buffer: Buffer, size: number) => {
	if (buffer.buffer.byteLength + size > DEFAULT_SIZE) {
		buffer.buffer.resize(buffer.buffer.byteLength * 2);
	}
};
