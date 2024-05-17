declare const encode: <const $Type extends Protocol.Any>(
	type: $Type,
	value: Infer<$Type>,
	chunks?: number,
) => ArrayBuffer;

export { encode };