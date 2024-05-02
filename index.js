import { decode, encode } from "./dist/index.js";

const test = {
	type: "object",
	properties: [
		{ key: "email", type: "string" },
		{
			key: "age",
			type: "int",
			nullable: true,
		},
		{
			key: "grade",
			type: "float",
			nullable: true,
		},
		{
			key: "tags",
			type: "array",
			item: "string",
		},
		{
			key: "role",
			type: "enum",
			options: ["ADMIN", "USER"],
		},
		{
			key: "location",
			type: "tuple",
			items: ["float", "float"],
		},
	],
};

const value = {
	email: "yamiteru@icloud.com",
	age: null,
	grade: 1.23,
	tags: ["hello", "world"],
	role: "ADMIN",
	location: [49.7384, 13.3736],
};

let _;

const blackbox = (v) => {
	const a = v;
	const b = a;

	_ = b;
};

for(let i = 0; i < 1_000_000; i++) {
	blackbox(decode(test, encode(test, value)));
}