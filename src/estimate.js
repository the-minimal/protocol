import { error } from "@the-minimal/error";

const EstimateError = error("EstimateError");

const ESTIMATE_TYPES = [
	() => 1,
	(_, index) => index - 10,
	(_, index) => index - 20,
	(_, index) => index - 30,
	(type, index) => {
		const size = index - (index < 45 ? 40 : 45);
		const bytes = index < 45 ? 1 : 3;
		const max = type.maxLength ? type.maxLength : size === 1 ? 256 : 65_536;

		return size + max * bytes;
	},
	(type) => type.value.reduce((acc, curr) => acc + runEstimate(curr), 0),
	(type, index) => {
		const size = index - 60;
		const max = type.maxLength ? type.maxLength : size === 1 ? 256 : 65_536;

		return size + max * runEstimate(type.value);
	},
	() => 1,
	(type) => type.value.reduce((acc, curr) => acc + runEstimate(curr), 0),
];

const runEstimate = (type) => {
	let index = type.type;
	let extra = 0;

	if (index > 99) {
		index -= 100;
		extra += 1;
	}

	return extra + ESTIMATE_TYPES[(index / 10) | 0](type, index);
};

const estimate = (type) => {
	try {
		const bytes = runEstimate(type);

		return {
			bytes,
			chunks: Math.ceil(bytes / 8_000),
		};
	} catch (e) {
		EstimateError(e);
	}
};

export { estimate };
