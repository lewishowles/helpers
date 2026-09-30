import { toNullableNumber } from "./to-nullable-number";
import { describe, expect, test } from "vite-plus/test";

describe("to-nullable-number", () => {
	describe("should return null for absent values", () => {
		test.for([
			["null", null],
			["undefined", undefined],
			["empty string", ""],
		])("%s", ([, input]) => {
			expect(toNullableNumber(input)).toBeNull();
		});
	});

	describe("should coerce to number", () => {
		test.for([
			["string (integer)", "42", 42],
			["string (float)", "3.14", 3.14],
			["string (negative)", "-7", -7],
			["string (zero)", "0", 0],
			["number (integer)", 42, 42],
			["number (zero)", 0, 0],
			["number (negative)", -7, -7],
			["number (float)", 3.14, 3.14],
			["boolean (true)", true, 1],
			["boolean (false)", false, 0],
		])("%s", ([, input, expected]) => {
			expect(toNullableNumber(input)).toBe(expected);
		});
	});

	test("should return NaN for non-numeric strings", () => {
		expect(toNullableNumber("hello")).toBeNaN();
	});
});
