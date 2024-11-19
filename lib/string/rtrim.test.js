import { describe, expect, test } from "vitest";
import { rtrim } from "./rtrim";

describe("rtrim", () => {
	test("should rtrim whitespace from a string by default", () => {
		expect(rtrim(" string ")).toBe(" string");
		expect(rtrim("\tstring\t")).toBe("\tstring");
		expect(rtrim("	string	")).toBe("	string");
	});

	test("should rtrim multiple all instances of whitespace from a string by default", () => {
		expect(rtrim("  string   ")).toBe("  string");
		expect(rtrim("\t\tstring\t\t\t")).toBe("\t\tstring");
		expect(rtrim("		string			")).toBe("		string");
	});

	test("should allow a rtrim pattern to be defined", () => {
		expect(rtrim("**string**", "*")).toBe("**string");
		expect(rtrim("**string**", "**")).toBe("**string");
		expect(rtrim("* *string* *", "*")).toBe("* *string* ");
	});

	test("should allow a rtrim RegExp to be defined", () => {
		expect(rtrim("**string**", /\*+/)).toBe("**string");
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
			expect(rtrim(input)).toBe("");
		});
	});

	describe("should handle an invalid rtrim pattern", () => {
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
			expect(rtrim("**string**", trimString)).toBe("**string**");
		});
	});
});
