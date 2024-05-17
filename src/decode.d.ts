import type { Infer, Protocol } from "./index.d.ts";

declare const decode: <$Type extends Protocol.Any>(
	type: $Type,
	buffer: ArrayBuffer,
) => Infer<$Type>;

export { decode };
