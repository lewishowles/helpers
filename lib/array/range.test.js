import { describe, expect, test } from "vite-plus/test";
import { range } from "./range";

describe("range", () => {
	describe("should return an empty array if start is not a number", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["NaN", NaN],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(range(input)).toEqual([]);
		});
	});

	describe("should return an empty array if end is not a number", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["NaN", NaN],
			["null", null],
		])("%s", ([, end]) => {
			expect(range(0, end)).toEqual([]);
		});
	});

	describe("should return an empty array if step is not a number or is zero", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["NaN", NaN],
			["null", null],
			["zero", 0],
		])("%s", ([, step]) => {
			expect(range(0, 5, step)).toEqual([]);
		});
	});

	test("should treat a single argument as end, starting from 0", () => {
		expect(range(5)).toEqual([0, 1, 2, 3, 4, 5]);
	});

	test("should return an array with one element when start equals end", () => {
		expect(range(3, 3)).toEqual([3]);
	});

	test("should generate an ascending range inclusive of end", () => {
		expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
	});

	test("should generate a descending range when start is greater than end", () => {
		expect(range(5, 0)).toEqual([5, 4, 3, 2, 1, 0]);
	});

	test("should generate a range with a positive step", () => {
		expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
	});

	test("should generate a range with a negative step", () => {
		expect(range(10, 0, -2)).toEqual([10, 8, 6, 4, 2, 0]);
	});

	test("should return an empty array when step goes in the wrong direction", () => {
		expect(range(0, 5, -1)).toEqual([]);
		expect(range(5, 0, 1)).toEqual([]);
	});

	test("should handle a step larger than the range", () => {
		expect(range(0, 3, 10)).toEqual([0]);
	});

	test("should handle negative ranges", () => {
		expect(range(-3, 0)).toEqual([-3, -2, -1, 0]);
		expect(range(0, -3)).toEqual([0, -1, -2, -3]);
	});
});
