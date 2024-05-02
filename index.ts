import type { Protocol } from "@types";
import { decode, encode } from "./src";

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
} satisfies Protocol.Any;

const value = {
	email: "yamiteru@icloud.com",
	age: null,
	grade: 1.23,
	tags: ["hello", "world"],
	role: "ADMIN",
	location: [49.7384, 13.3736],
};

const a = encode(test, value);

// encode(register, value);

console.log(a);

const b = decode(test, a);

console.log(b);
