import { describe, expect, test } from "vitest";
import { hasAny } from "./has-any";

describe("has-any", () => {
	describe("should return false if the input is not a non-empty object", () => {
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
			expect(hasAny(input, ["a"])).toBe(false);
		});
	});

	describe("should return false if `paths` is not a non-empty array", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, paths]) => {
			expect(hasAny({ a: 1 }, paths)).toBe(false);
		});
	});

	test("should return true if object has any of the given properties", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(hasAny(object, ["a"])).toBe(true);
		expect(hasAny(object, ["b", "d"])).toBe(true);
	});

	test("should return false if object does not have any of the given properties", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(hasAny(object, ["d"])).toBe(false);
		expect(hasAny(object, ["e", "f"])).toBe(false);
	});

	test("should return true if object has any of the deeply nested properties", () => {
		const object = { a: { b: { c: 1 } } };

		expect(hasAny(object, ["a.b.c"])).toBe(true);
		expect(hasAny(object, ["a.b.d", "a.b.c"])).toBe(true);
	});

	test("should return false if object does not have any of the deeply nested properties", () => {
		const object = { a: { b: { c: 1 } } };

		expect(hasAny(object, ["a.b.d"])).toBe(false);
		expect(hasAny(object, ["a.b.e", "a.b.f"])).toBe(false);
	});
});
