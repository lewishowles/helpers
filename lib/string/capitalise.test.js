import { capitalise } from "./capitalise";
import { describe, expect, test } from "vite-plus/test";

describe("capitalise", () => {
	describe("should capitalise the first character", () => {
		test.for([
			["lowercase word", "hello", "Hello"],
			["lowercase sentence", "hello world", "Hello world"],
			["already capitalised", "Hello", "Hello"],
			["all uppercase", "HELLO", "HELLO"],
			["mixed case", "hELLO", "HELLO"],
			["single character", "a", "A"],
			["single character uppercase", "A", "A"],
			["starts with number", "1st place", "1st place"],
			["starts with space", " leading", " leading"],
			["german umlaut", "über", "Über"],
			["german sharp s (ß → SS)", "ßtraße", "SStraße"],
			["greek lowercase", "αβγ", "Αβγ"],
			["greek with diacritic", "άγγελος", "Άγγελος"],
			["cyrillic lowercase", "привет", "Привет"],
			["arabic (no uppercase concept)", "مرحبا", "مرحبا"],
			["cjk (no uppercase concept)", "你好", "你好"],
		])("%s", ([, input, expected]) => {
			expect(capitalise(input)).toBe(expected);
		});
	});

	describe("should handle surrogate pairs", () => {
		test("emoji first character stays intact", () => {
			expect(capitalise("😀hello")).toBe("😀hello");
		});

		test("astral plane character with uppercase form", () => {
			// U+10437 DESERET SMALL LETTER OW → U+1040F DESERET CAPITAL LETTER OW
			expect(capitalise("𐐷test")).toBe("𐐏test");
		});

		test("single emoji", () => {
			expect(capitalise("😀")).toBe("😀");
		});

		test("surrogate pair does not split", () => {
			const result = capitalise("😀abc");

			// 😀 is a surrogate pair (2 UTF-16 code units) + "abc" = 5 code units
			expect(result.length).toBe(5);
			expect(result).toBe("😀abc");
		});
	});

	describe("should return empty string for non-string inputs", () => {
		test.for([
			["empty string", ""],
			["number", 42],
			["boolean", true],
			["null", null],
			["undefined", undefined],
			["array", ["a", "b"]],
			["object", { key: "value" }],
		])("%s", ([, input]) => {
			expect(capitalise(input)).toBe("");
		});
	});
});
