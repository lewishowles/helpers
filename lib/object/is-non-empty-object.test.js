import { describe, expect, test } from "vitest";
import { isNonEmptyObject } from "./is-non-empty-object";

describe("is-non-empty-object", () => {
	test("should return true for non-empty objects", () => {
		expect(isNonEmptyObject({ property: "value" })).toBe(true);
		expect(isNonEmptyObject({ property: ["value"], value: "property" })).toBe(true);
	});

	test("should return false for an empty object", () => {
		expect(isNonEmptyObject({})).toBe(false);
	});

	describe("should return false for non-objects", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isNonEmptyObject(input)).toBe(false);
		});
	});
});
