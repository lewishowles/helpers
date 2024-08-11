import { describe, expect, test } from "vitest";
import { arrayLength } from "./array-length";

describe("array-length", () => {
	describe("should return 0 for non-arrays", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(arrayLength(input)).toBe(0);
		});
	});

	test("should return the length of an array", () => {
		expect(arrayLength([0, 1, 2, 3, 4])).toBe(5);
		expect(arrayLength([0])).toBe(1);
		expect(arrayLength([])).toBe(0);
	});
});
