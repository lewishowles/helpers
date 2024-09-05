import { describe, expect, test } from "vitest";
import { getNextIndex } from "./get-next-index";

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

	test("should return the next index", () => {
		expect(getNextIndex(0, referenceArray)).toBe(1);
		expect(getNextIndex(1, referenceArray)).toBe(2);
	});

	test("should stop at the end of the array", () => {
		expect(getNextIndex(4, referenceArray)).toBe(4);
	});

	test("should wrap when enabled", () => {
		expect(getNextIndex(4, referenceArray, { wrap: true })).toBe(0);
		expect(getNextIndex(5, referenceArray, { wrap: true })).toBe(1);
	});

	test("should reverse when enabled", () => {
		expect(getNextIndex(4, referenceArray, { reverse: true })).toBe(3);
	});

	test("should wrap in reverse when both reserve and wrap are enabled", () => {
		expect(getNextIndex(0, referenceArray, { reverse: true, wrap: true })).toBe(4);
		expect(getNextIndex(-1, referenceArray, { reverse: true, wrap: true })).toBe(3);
		expect(getNextIndex(-2, referenceArray, { reverse: true, wrap: true })).toBe(2);
		expect(getNextIndex(-3, referenceArray, { reverse: true, wrap: true })).toBe(1);
	});
});
