import type { Protocol } from "@types";
import { decode } from "./src/decode";
import { encode } from "./src/encode";

const test = {
	type: "object",
	properties: [
		{ key: "email", type: "ascii" },
		{
			key: "age",
			type: "int",
			nullable: true,
			assert: (v) => {
				if (<any>v < 0 || <any>v > 150) {
					throw Error("Age should be between 0 and 150");
				}

				return v;
			},
		},
		{
			key: "grade",
			type: "float",
		},
		{
			key: "tags",
			type: "array",
			item: {
				type: "ascii",
			},
		},
		{
			key: "role",
			type: "enum",
			options: ["ADMIN", "USER"],
		},
		{
			key: "location",
			type: "tuple",
			items: [{ type: "float" }, { type: "float" }],
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
