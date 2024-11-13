import { describe, expect, test } from "vitest";
import { objectLength } from "./object-length";

describe("object-length", () => {
	describe("should reject anything but a non-empty object", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(objectLength(input)).toBe(0);
		});
	});

	test("should detect the number of keys in an object", () => {
		expect(objectLength({})).toBe(0);
		expect(objectLength({
			a: 1, b: 2, c: 3, d: [4, 5, 6], e: 7,
		})).toBe(5);
	});

	test("should only account for the top level", () => {
		expect(objectLength({ a: 1, b: 2, c: { d: 3, e: 4 } })).toBe(3);
	});
});
