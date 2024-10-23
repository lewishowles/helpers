import { describe, expect, test } from "vitest";
import { isNonEmptyString } from "./is-non-empty-string";

describe("is-non-empty-string", () => {
	test("should return true for non-empty strings", () => {
		expect(isNonEmptyString("string")).toBe(true);
		expect(isNonEmptyString("弦")).toBe(true);
		expect(isNonEmptyString("Zeichenfolge")).toBe(true);
		expect(isNonEmptyString("சரம்")).toBe(true);
	});

	test("should return false for an empty string", () => {
		expect(isNonEmptyString("")).toBe(false);
	});

	test("should return true for a whitespace-only string if trim is not enabled", () => {
		expect(isNonEmptyString("   ")).toBe(true);
	});

	test("should return false for a whitespace-only string if trim is enabled", () => {
		expect(isNonEmptyString("   ", { trim: true })).toBe(false);
	});

	describe("should return false for non-strings", () => {
		test.for([
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
