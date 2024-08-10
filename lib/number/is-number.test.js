import { describe, expect, it } from "vitest";
import { isNumber } from "./is-number";

describe("isNumber", () => {
	it("should return true for numbers", () => {
		expect(isNumber(123)).toBe(true);
		expect(isNumber(0)).toBe(true);
		expect(isNumber(-123)).toBe(true);
		expect(isNumber(1.23)).toBe(true);
	});

	it("should return false for NaN", () => {
		expect(isNumber(NaN)).toBe(false);
	});

	describe("should return false for non-numbers", () => {
		it.for([
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isNumber(input)).toBe(false);
		});
	});
});
