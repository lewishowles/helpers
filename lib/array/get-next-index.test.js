import { getNextIndex } from "./get-next-index";
import { describe, expect, test } from "vite-plus/test";

describe("get-next-index", () => {
	const referenceArray = [1, 2, 3, 4, 5];

	describe("should return 0 if the provided index is not a number", () => {
		test.for([
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, index]) => {
			expect(getNextIndex(index, referenceArray)).toBe(0);
		});
	});

	test.for([1.5, -1.5, NaN, Infinity, -Infinity])(
		"returns 0 for a non-whole index (%s) with every movement option",
		(index) => {
			expect(getNextIndex(index, referenceArray)).toBe(0);
			expect(getNextIndex(index, referenceArray, { reverse: true })).toBe(0);
			expect(getNextIndex(index, referenceArray, { wrap: true })).toBe(0);
			expect(getNextIndex(index, referenceArray, { reverse: true, wrap: true })).toBe(0);
		},
	);

	test("returns 0 for an empty or non-array reference", () => {
		expect(getNextIndex(0, [])).toBe(0);
		expect(getNextIndex(0, [], { reverse: true, wrap: true })).toBe(0);
		expect(getNextIndex(0, null, { wrap: true })).toBe(0);
	});

	test("should return the next index", () => {
		expect(getNextIndex(0, referenceArray)).toBe(1);
		expect(getNextIndex(1, referenceArray)).toBe(2);
	});

	test("should clamp to the ends of the array", () => {
		expect(getNextIndex(4, referenceArray)).toBe(4);
		expect(getNextIndex(9, referenceArray)).toBe(4);
		expect(getNextIndex(-9, referenceArray)).toBe(0);
	});

	test("should wrap when enabled", () => {
		expect(getNextIndex(4, referenceArray, { wrap: true })).toBe(0);
		expect(getNextIndex(5, referenceArray, { wrap: true })).toBe(1);
		expect(getNextIndex(-1, referenceArray, { wrap: true })).toBe(0);
	});

	test("should reverse when enabled", () => {
		expect(getNextIndex(4, referenceArray, { reverse: true })).toBe(3);
		expect(getNextIndex(-9, referenceArray, { reverse: true })).toBe(0);
		expect(getNextIndex(9, referenceArray, { reverse: true })).toBe(4);
	});

	test("should wrap in reverse when both reserve and wrap are enabled", () => {
		expect(getNextIndex(0, referenceArray, { reverse: true, wrap: true })).toBe(4);
		expect(getNextIndex(-1, referenceArray, { reverse: true, wrap: true })).toBe(3);
		expect(getNextIndex(-2, referenceArray, { reverse: true, wrap: true })).toBe(2);
		expect(getNextIndex(-3, referenceArray, { reverse: true, wrap: true })).toBe(1);
		expect(getNextIndex(-2, [1, 2, 3], { reverse: true, wrap: true })).toBe(0);
		expect(getNextIndex(0, [1], { reverse: true, wrap: true })).toBe(0);
	});
});
