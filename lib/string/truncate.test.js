import { describe, expect, test } from "vitest";
import { truncate } from "./truncate.js";

describe("truncate", () => {
	test("should truncate a string with default settings", () => {
		expect(truncate("abcdefghijk")).toBe("abcdefghi…");
	});

	test("should not truncate if not necessary", () => {
		expect(truncate("abcd")).toBe("abcd");
	});

	test("should allow a custom length", () => {
		expect(truncate("abcdefghijk", 5)).toBe("abcd…");
	});

	describe("decoration", () => {
		test("should allow custom decoration to be added", () => {
			expect(truncate("abcdefghijk", 5, { decoration: ">>" })).toBe("abc>>");
		});
	});

	describe("preserveWords", () => {
		test("should not preserve words by default", () => {
			expect(truncate("one two three", 6)).toBe("one t…");
		});

		test("should allow a word to be preserved", () => {
			expect(truncate("one two three", 5, { preserveWords: true })).toBe("one…");
		});
	});

	describe("strict", () => {
		test("should be strict by default", () => {
			expect(truncate("one two three", 5, { preserveWords: true })).toBe("one…");
		});

		test("should allow strict to be overridden", () => {
			expect(truncate("one two three", 6, { preserveWords: true, strict: false })).toBe("one two…");
		});

		test("should handle strict and preserve for a single word that is too long", () => {
			expect(truncate("one-two-three", 5, { preserveWords: true, strict: true })).toBe("…");
		});
	});

	describe("includeDecoration", () => {
		test("should include the length of the decoration in the length calculation by default", () => {
			expect(truncate("abcdefghijk", 5)).toBe("abcd…");
		});

		test("should allow decoration to be excluded", () => {
			expect(truncate("abcdefghijk", 5, { includeDecoration: false })).toBe("abcde…");
		});
	});
});
