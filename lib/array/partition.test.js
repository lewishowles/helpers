import { describe, expect, test } from "vite-plus/test";
import { partition } from "./partition";

describe("partition", () => {
	const isEven = (n) => n % 2 === 0;

	describe("should return [[], []] for a non-array", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { a: 1 }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(partition(input, isEven)).toEqual([[], []]);
		});
	});

	describe("should return [[], []] for a non-function predicate", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { a: 1 }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(partition([1, 2, 3], input)).toEqual([[], []]);
		});
	});

	test("should split array based on predicate", () => {
		expect(partition([1, 2, 3, 4, 5], isEven)).toEqual([
			[2, 4],
			[1, 3, 5],
		]);
	});

	test("should return [all, []] when all items match", () => {
		expect(partition([2, 4, 6], isEven)).toEqual([[2, 4, 6], []]);
	});

	test("should return [[], all] when no items match", () => {
		expect(partition([1, 3, 5], isEven)).toEqual([[], [1, 3, 5]]);
	});

	test("should return [[], []] for an empty array", () => {
		expect(partition([], isEven)).toEqual([[], []]);
	});

	test("should not modify the original array", () => {
		const original = [1, 2, 3, 4, 5];

		partition(original, isEven);

		expect(original).toEqual([1, 2, 3, 4, 5]);
	});
});
