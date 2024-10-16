import { describe, expect, test } from "vitest";
import { clamp } from "./clamp";

describe("clamp", () => {
	test("should return a number between the default minimum and maximum", () => {
		expect(clamp(10)).toBe(10);
		expect(clamp(1)).toBe(1);
		expect(clamp(100)).toBe(100);
		expect(clamp(24)).toBe(24);
	});

	test("should return a number between the provided minimum and maximum", () => {
		expect(clamp(10, 10, 20)).toBe(10);
		expect(clamp(11, 10, 20)).toBe(11);
		expect(clamp(12, 10, 20)).toBe(12);
		expect(clamp(20, 10, 20)).toBe(20);
	});

	test("should return the minimum value for numbers below the minimum", () => {
		expect(clamp(0, 10, 20)).toBe(10);
		expect(clamp(-10, 10, 20)).toBe(10);
	});

	test("should return the maximum value for numbers below the maximum", () => {
		expect(clamp(30, 10, 20)).toBe(20);
		expect(clamp(1e5, 10, 20)).toBe(20);
	});

	describe("should return the minimum value for non-numbers", () => {
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
			expect(clamp(input, 10, 20)).toBe(10);
		});
	});
});
