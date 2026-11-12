import { trim } from "./trim";
import { describe, expect, test } from "vite-plus/test";

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

	test("removes whole repeated copies of a string pattern from both sides", () => {
		expect(trim("ababXabab", "ab")).toBe("X");
		expect(trim("abbbXbbab", "ab")).toBe("bbXbb");
		expect(trim("abab", "ab")).toBe("");
		expect(trim("ababa", "ab")).toBe("a");
		expect(trim("aaa", "aa")).toBe("a");
	});

	test("handles long runs of whitespace or a repeated pattern quickly", () => {
		const start = performance.now();

		expect(trim(`X${" ".repeat(30_000)}Y`)).toBe(`X${" ".repeat(30_000)}Y`);
		expect(performance.now() - start).toBeLessThan(100);

		const patternStart = performance.now();

		expect(trim(`X${"-".repeat(30_000)}Y`, "-")).toBe(`X${"-".repeat(30_000)}Y`);
		expect(performance.now() - patternStart).toBeLessThan(100);

		expect(trim(`X${" ".repeat(100_000)}Y`)).toBe(`X${" ".repeat(100_000)}Y`);
		expect(trim(`X${"-".repeat(100_000)}Y`, "-")).toBe(`X${"-".repeat(100_000)}Y`);
		expect(trim(`${"ab".repeat(50_000)}X`, "ab")).toBe("X");
	}, 1_000);

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
