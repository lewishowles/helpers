import { rtrim } from "./rtrim";
import { describe, expect, test } from "vite-plus/test";

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

	test("removes whole repeated copies of a string pattern from the right", () => {
		expect(rtrim("ababXabab", "ab")).toBe("ababX");
		expect(rtrim("bbXbbab", "ab")).toBe("bbXbb");
		expect(rtrim("abab", "ab")).toBe("");
		expect(rtrim("aabab", "ab")).toBe("a");
	});

	test("handles long runs of whitespace or a repeated pattern quickly", () => {
		const start = performance.now();

		expect(rtrim(`${" ".repeat(30_000)}X`)).toBe(`${" ".repeat(30_000)}X`);
		expect(performance.now() - start).toBeLessThan(100);

		const patternStart = performance.now();

		expect(rtrim(`${"-".repeat(30_000)}X`, "-")).toBe(`${"-".repeat(30_000)}X`);
		expect(performance.now() - patternStart).toBeLessThan(100);

		expect(rtrim(`${" ".repeat(100_000)}X`)).toBe(`${" ".repeat(100_000)}X`);
		expect(rtrim(`${"-".repeat(100_000)}X`, "-")).toBe(`${"-".repeat(100_000)}X`);
		expect(rtrim(`X${"ab".repeat(50_000)}`, "ab")).toBe("X");
	}, 1_000);

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
