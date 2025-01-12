import { describe, expect, test } from "vitest";
import { values } from "./values";

describe("values", () => {
	test("should return values of an object", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(values(object)).toEqual([1, 2, 3]);
	});

	test("should return an empty array when the object is empty", () => {
		const object = {};

		expect(values(object)).toEqual([]);
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
			expect(values(input)).toEqual([]);
		});
	});
});
