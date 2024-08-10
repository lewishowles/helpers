import { describe, expect, it } from "vitest";
import { getNextIndex } from "./get-next-index";

describe("get-next-index", () => {
	const referenceArray = [1, 2, 3, 4, 5];

	describe("should return 0 if the provided index is not a number", () => {
		it.for([
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

	it("should return zero if the provided index is outside of the array", () => {
		expect(getNextIndex(10, referenceArray)).toBe(0);
		expect(getNextIndex(-1, referenceArray)).toBe(0);
	});

	it("should return the next index", () => {
		expect(getNextIndex(0, referenceArray)).toBe(1);
		expect(getNextIndex(1, referenceArray)).toBe(2);
	});

	it("should stop at the end of the array", () => {
		expect(getNextIndex(4, referenceArray)).toBe(4);
	});

	it("should wrap when enabled", () => {
		expect(getNextIndex(4, referenceArray, { wrap: true })).toBe(0);
	});

	it("should reverse when enabled", () => {
		expect(getNextIndex(4, referenceArray, { reverse: true })).toBe(3);
	});

	it("should wrap in reverse when both reserve and wrap are enabled", () => {
		expect(getNextIndex(0, referenceArray, { reverse: true, wrap: true })).toBe(4);
	});
});
