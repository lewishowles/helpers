import { describe, expect, test } from "vitest";
import { keys } from "./keys";

describe("keys", () => {
	test("should return keys of a non-empty object", () => {
		const obj = { a: 1, b: 2, c: 3 };

		expect(keys(obj)).toEqual(["a", "b", "c"]);
	});

	test("should return an empty array for an empty object", () => {
		const obj = {};

		expect(keys(obj)).toEqual([]);
	});

	describe("should return an empty array when input is not an object", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(keys(input)).toEqual([]);
		});
	});
});
