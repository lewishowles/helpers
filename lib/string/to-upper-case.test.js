import { describe, expect, test } from "vitest";
import { toUpperCase } from "./to-upper-case";

describe("to-upper-case", () => {
	test("should upper case a string", () => {
		expect(toUpperCase("String")).toBe("STRING");
		expect(toUpperCase("StringWithMultipleCapitals")).toBe("STRINGWITHMULTIPLECAPITALS");
	});

	describe("should handle a non-string", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(toUpperCase(input)).toBe("");
		});
	});
});
