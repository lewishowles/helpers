import { describe, expect, test } from "vitest";
import { ltrim } from "./ltrim";

describe("ltrim", () => {
	test("should ltrim whitespace from a string by default", () => {
		expect(ltrim(" string ")).toBe("string ");
		expect(ltrim("\tstring\t")).toBe("string\t");
		expect(ltrim("	string	")).toBe("string	");
	});

	test("should ltrim multiple all instances of whitespace from a string by default", () => {
		expect(ltrim("  string   ")).toBe("string   ");
		expect(ltrim("\t\tstring\t\t\t")).toBe("string\t\t\t");
		expect(ltrim("		string			")).toBe("string			");
	});

	test("should allow a ltrim pattern to be defined", () => {
		expect(ltrim("**string**", "*")).toBe("string**");
		expect(ltrim("**string**", "**")).toBe("string**");
		expect(ltrim("* *string* *", "*")).toBe(" *string* *");
	});

	test("should allow a ltrim RegExp to be defined", () => {
		expect(ltrim("**string**", /\*+/)).toBe("string**");
	});

	describe("should handle an invalid input", () => {
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
			expect(ltrim(input)).toBe("");
		});
	});

	describe("should handle an invalid ltrim pattern", () => {
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
		])("%s", ([, trimString]) => {
			expect(ltrim("**string**", trimString)).toBe("**string**");
		});
	});
});
