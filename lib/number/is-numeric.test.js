import { describe, expect, test } from "vitest";
import { isNumeric } from "./is-numeric";

describe("is-numeric", () => {
	test("should detect a number", () => {
		expect(isNumeric(123)).toBe(true);
		expect(isNumeric(10e4)).toBe(true);
		expect(isNumeric(5.1)).toBe(true);
	});

	test("should detect a numeric string", () => {
		expect(isNumeric("123")).toBe(true);
		expect(isNumeric("10e4")).toBe(true);
		expect(isNumeric("5.1")).toBe(true);
	});

	describe("should detect any non-numeric value", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isNumeric(input)).toBe(false);
		});
	});
});
