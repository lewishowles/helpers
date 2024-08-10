import { describe, expect, it } from "vitest";
import { isNonEmptyString } from "./is-non-empty-string";

describe("is-non-empty-string", () => {
	it("should return true for non-empty strings", () => {
		expect(isNonEmptyString("string")).toBe(true);
		expect(isNonEmptyString("弦")).toBe(true);
		expect(isNonEmptyString("Zeichenfolge")).toBe(true);
		expect(isNonEmptyString("சரம்")).toBe(true);
	});

	it("should return false for an empty string", () => {
		expect(isNonEmptyString("")).toBe(false);
	});

	describe("should return false for non-strings", () => {
		it.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isNonEmptyString(input)).toBe(false);
		});
	});
});
