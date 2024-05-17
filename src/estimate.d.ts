import type { Protocol } from "./index.d.ts";

declare const estimate: <const $Type extends Protocol.Any>(
	type: $Type,
) => {
	bytes: number;
	chunks: number;
};

export { estimate };
