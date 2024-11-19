import { describe, expect, test } from "vitest";
import { toLowerCase } from "./to-lower-case";

describe("to-lower-case", () => {
	test("should lower case a string", () => {
		expect(toLowerCase("String")).toBe("string");
		expect(toLowerCase("StringWithMultipleCapitals")).toBe("stringwithmultiplecapitals");
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
			expect(toLowerCase(input)).toBe("");
		});
	});
});
