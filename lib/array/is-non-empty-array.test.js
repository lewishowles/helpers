import { describe, expect, it } from "vitest";
import { isNonEmptyArray } from "./is-non-empty-array";

describe("is-non-empty-array", () => {
	it("should return true for non-empty arrays", () => {
		expect(isNonEmptyArray(["one"])).toBe(true);
		expect(isNonEmptyArray(["one", "two"])).toBe(true);
	});

	it("should return false for an empty array", () => {
		expect(isNonEmptyArray([])).toBe(false);
	});

	describe("should return false for non-arrays", () => {
		it.for([
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
			expect(isNonEmptyArray(input)).toBe(false);
		});
	});
});
