import { describe, expect, test } from "vitest";
import { isObject } from "./is-object";

describe("is-object", () => {
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
			expect(isObject(input)).toBe(false);
		});
	});

	test("should return true for an object", () => {
		expect(isObject({ property: "value" })).toBe(true);
	});
});
