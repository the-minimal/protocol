import type { Protocol } from "@types";
import { decode } from "./src/decoder";
import { encode } from "./src/encoder";

const register = {
	type: "object",
	properties: [
		{ key: "name", type: "ascii" },
		{ key: "email", type: "ascii" },
		{ key: "password", type: "ascii" },
		{
			key: "age",
			type: "int",
			nullable: true,
			parse: (v) => {
				if (<any>v < 0 || <any>v > 150) {
					throw Error("Age should be between 0 and 150");
				}

				return v;
			},
		},
	],
} satisfies Protocol.Any;

const value = {
	name: "Miroslav Vrsecky",
	email: "yamiteru@icloud.com",
	password: "Test123456",
	age: null,
};

const a = encode(register, value);

console.log(a);

const b = decode(register, a);

console.log(b);
