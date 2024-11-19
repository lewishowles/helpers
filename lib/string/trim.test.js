import { describe, expect, test } from "vitest";
import { trim } from "./trim";

describe("trim", () => {
	test("should trim whitespace from a string by default", () => {
		expect(trim(" string ")).toBe("string");
		expect(trim("\tstring\t")).toBe("string");
		expect(trim("	string	")).toBe("string");
	});

	test("should trim multiple all instances of whitespace from a string by default", () => {
		expect(trim("  string   ")).toBe("string");
		expect(trim("\t\tstring\t\t\t")).toBe("string");
		expect(trim("		string			")).toBe("string");
	});

	test("should allow a trim pattern to be defined", () => {
		expect(trim("**string**", "*")).toBe("string");
		expect(trim("**string**", "**")).toBe("string");
		expect(trim("* *string* *", "*")).toBe(" *string* ");
	});

	test("should allow a trim RegExp to be defined", () => {
		expect(trim("**string**", /\*+/)).toBe("string");
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
			expect(trim(input)).toBe("");
		});
	});

	describe("should handle an invalid trim pattern", () => {
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
			expect(trim("**string**", trimString)).toBe("**string**");
		});
	});
});
