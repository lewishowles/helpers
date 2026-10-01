import { isPlainObject } from "./is-plain-object";
import { describe, expect, test } from "vite-plus/test";

describe("is-plain-object", () => {
	describe("should return false for non-plain-objects", () => {
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
			["Date", new Date()],
			["Map", new Map()],
			[
				"class instance",
				new (class {
					// The field makes this an instance with an own property.
					a = 1;
				})(),
			],
		])("%s", ([, input]) => {
			expect(isPlainObject(input)).toBe(false);
		});
	});

	test("should return true for a plain object", () => {
		expect(isPlainObject({ property: "value" })).toBe(true);
	});

	test("should return true for an empty object", () => {
		expect(isPlainObject({})).toBe(true);
	});
});
