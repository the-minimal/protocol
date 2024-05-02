export type Buffer = {
	offset: number;
	buffer: ArrayBuffer;
	view: DataView;
};

const FREE: Buffer[] = [];

const MAX_BUFFERS = 10;
const DEFAULT_SIZE = 1000;
const MAX_SIZE = 512_000;

const SETTINGS = {
	MAX_BUFFERS,
	DEFAULT_SIZE,
	MAX_SIZE,
};

export const setup = (
	settings: Partial<{
		maxBuffers: number;
		defaultSize: number;
		maxSize: number;
	}>,
) => {
	SETTINGS.MAX_BUFFERS = settings.maxBuffers ?? MAX_BUFFERS;
	SETTINGS.DEFAULT_SIZE = settings.defaultSize ?? DEFAULT_SIZE;
	SETTINGS.MAX_SIZE = settings.maxSize ?? MAX_SIZE;
};

export const alloc = (): Buffer => {
	if (FREE.length) {
		return FREE.pop() as Buffer;
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

export const free = (buffer: Buffer) => {
	if (FREE.length < SETTINGS.MAX_BUFFERS) {
		buffer.buffer.resize(SETTINGS.DEFAULT_SIZE);
		buffer.offset = 0;

		FREE.push(buffer);
	}
};

export const check = (buffer: Buffer, size: number) => {
	if (buffer.offset + size > SETTINGS.DEFAULT_SIZE) {
		buffer.buffer.resize(buffer.buffer.byteLength * 2);
	}
};
