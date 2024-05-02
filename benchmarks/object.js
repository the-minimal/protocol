import { Bench } from 'tinybench';
import {encode} from "../dist/index.js";
import avro from "avsc";

const protocolType = {
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

const avroType = avro.Type.forSchema({
	type: 'record',
	name: 'test',
	fields: [
		{name: 'email', type: "string"},
		{name: 'age', type: ["null", 'int']},
		{name: 'grade', type: ["null", 'float']},
		{name: 'tags', type: {type: 'array', items: 'string'}},
		{name: 'role', type: {type: 'enum', name: "idk", symbols: ['ADMIN', 'USER']}},
		{name: 'location', type: {type: 'array', items: 'float'}}
	]
});

let protocolInput = {};
let avroInput = {};
let jsonInput = {};

let protocolOutput = new ArrayBuffer(1);
let avroOutput = new Buffer(1);
let jsonOutput = "";

const bench = new Bench();

bench
    .add('json', () => {
        jsonOutput = JSON.stringify(jsonInput);
    }, {
        beforeEach: () => {
            jsonInput = {
                email: "yamiteru@icloud.com",
                age: null,
                grade: 1.23,
                tags: ["hello", "world"],
                role: "ADMIN",
                location: [49.7384, 13.3736],
            };
        }
    })
	.add('avro', () => {
		avroOutput = avroType.toBuffer(avroInput);
	}, {
		beforeEach: () => {
			avroInput = {
                email: "yamiteru@icloud.com",
                age: null,
                grade: 1.23,
                tags: ["hello", "world"],
                role: "ADMIN",
                location: [49.7384, 13.3736],
            };
		}
	})
    .add('protocol', () => {
        protocolOutput = encode(protocolType, protocolInput);
    }, {
        beforeEach: () => {
            protocolInput = {
                email: "yamiteru@icloud.com",
                age: null,
                grade: 1.23,
                tags: ["hello", "world"],
                role: "ADMIN",
                location: [49.7384, 13.3736],
            };
        }
    });

await bench.warmup();
await bench.run();

console.table(bench.table());