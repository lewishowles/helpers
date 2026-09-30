import { truncate } from "./truncate.js";
import { describe, expect, test } from "vite-plus/test";

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

	describe("position", () => {
		describe("should default to end", () => {
			test("should truncate from the end by default", () => {
				expect(truncate("abcdefghijk", 8)).toBe("abcdefg…");
				expect(truncate("abcdefghijk", 8, { position: "end" })).toBe("abcdefg…");
			});
		});

		describe("start", () => {
			test("should truncate from the start with decoration leading", () => {
				// includeDecoration default true: effective length = 8 - 1 = 7
				expect(truncate("abcdefghijk", 8, { position: "start" })).toBe("…efghijk");
			});

			test("should truncate from the start with custom length", () => {
				expect(truncate("abcdefghijk", 5, { position: "start" })).toBe("…hijk");
			});

			test("should handle includeDecoration false", () => {
				expect(truncate("abcdefghijk", 5, { position: "start", includeDecoration: false })).toBe(
					"…ghijk",
				);
			});

			test("should handle custom decoration", () => {
				// includeDecoration default true: effective length = 6 - 2 = 4
				expect(truncate("abcdefghijk", 6, { position: "start", decoration: ">>" })).toBe(">>hijk");
			});

			test("should return just decoration when effective length is 0", () => {
				expect(truncate("abcdef", 1, { position: "start" })).toBe("…");
			});

			test("should return just decoration when length is 0", () => {
				expect(truncate("abcdef", 0, { position: "start" })).toBe("…");
			});

			test("should not truncate when string fits", () => {
				expect(truncate("abc", 5, { position: "start" })).toBe("abc");
			});
		});

		describe("middle", () => {
			test("should truncate from the middle with decoration in centre", () => {
				expect(truncate("abcdefghijk", 8, { position: "middle" })).toBe("abcd…ijk");
			});

			test("should split evenly when length is even", () => {
				expect(truncate("abcdefghijk", 7, { position: "middle" })).toBe("abc…ijk");
			});

			test("should give extra char to start when length is odd", () => {
				// effective length = 6 - 1 = 5, ceil(5/2)=3, floor(5/2)=2
				expect(truncate("abcdefghijk", 6, { position: "middle" })).toBe("abc…jk");
			});

			test("should handle includeDecoration false", () => {
				expect(truncate("abcdefghijk", 7, { position: "middle", includeDecoration: false })).toBe(
					"abcd…ijk",
				);
			});

			test("should handle custom decoration", () => {
				// effective length = 8 - 3 = 5, ceil(5/2)=3, floor(5/2)=2
				expect(truncate("abcdefghijk", 8, { position: "middle", decoration: "..." })).toBe(
					"abc...jk",
				);
			});

			test("should return just decoration when effective length is 0", () => {
				expect(truncate("abcdef", 1, { position: "middle" })).toBe("…");
			});

			test("should return just decoration when length is 0", () => {
				expect(truncate("abcdef", 0, { position: "middle" })).toBe("…");
			});

			test("should handle effective length of 1", () => {
				expect(truncate("abcdef", 2, { position: "middle" })).toBe("a…");
			});

			test("should handle effective length of 2", () => {
				expect(truncate("abcdef", 3, { position: "middle" })).toBe("a…f");
			});

			test("should not truncate when string fits", () => {
				expect(truncate("abc", 5, { position: "middle" })).toBe("abc");
			});
		});

		describe("invalid position values", () => {
			test("should fall back to end behaviour for invalid position", () => {
				expect(truncate("abcdefghijk", 5, { position: "invalid" })).toBe("abcd…");
			});

			test("should fall back to end behaviour for non-string position", () => {
				expect(truncate("abcdefghijk", 5, { position: 42 })).toBe("abcd…");
			});

			test("should fall back to end behaviour for invalid position with preserveWords", () => {
				expect(truncate("one two three", 7, { position: "invalid", preserveWords: true })).toBe(
					"one…",
				);
			});
		});

		describe("preserveWords interaction", () => {
			test("should preserve words from the end for start position", () => {
				// effective length = 12 - 1 = 11, three (5) + four (4) + sep = 10, two (3) + sep = 14 > 11
				expect(truncate("one two three four", 12, { position: "start", preserveWords: true })).toBe(
					"…three four",
				);
			});

			test("should preserve words from both sides for middle position", () => {
				// effective length = 15 - 1 = 14, startBudget = 7, endBudget = 7
				// start: one (3) + two (3) + sep = 7, three (5) + sep = 13 > 7
				// end: five (4) = 4, four (4) + sep = 9 > 7
				expect(
					truncate("one two three four five", 15, { position: "middle", preserveWords: true }),
				).toBe("one two…five");
			});

			test("should handle middle preserveWords with no end words fitting", () => {
				// effective length = 8 - 1 = 7, startBudget = 4, endBudget = 3
				// start: one (3) = 3, two (3) + sep = 7 >= 4
				// end: three (5) > 3, nothing fits
				expect(truncate("one two three", 8, { position: "middle", preserveWords: true })).toBe(
					"one…",
				);
			});

			test("should handle middle preserveWords with overlap guard", () => {
				// "one two three four" (18 chars), effective length = 14 - 1 = 13
				// startBudget = 7, endBudget = 6
				// start (non-strict): one (3) + two (3) + sep = 7 >= 7, startIndex = 1
				// end (non-strict): four (4) + three (5) + sep = 10 >= 6, overshoots
				// two is skipped by the i > startIndex guard, with no duplication
				expect(
					truncate("one two three four", 14, {
						position: "middle",
						preserveWords: true,
						strict: false,
					}),
				).toBe("one two…three four");
			});

			test("should apply preserveWords for end position", () => {
				expect(truncate("one two three", 8, { position: "end", preserveWords: true })).toBe(
					"one two…",
				);
			});

			test("should include an exactly fitting first word", () => {
				expect(truncate("four five", 5, { preserveWords: true })).toBe("four…");
				expect(truncate("five four", 5, { position: "start", preserveWords: true })).toBe("…four");
			});

			test("should handle strict for start preserveWords", () => {
				// effective length = 10 - 1 = 9, four (4) fits, three (5) + sep = 10 > 9
				expect(
					truncate("one two three four", 10, {
						position: "start",
						preserveWords: true,
						strict: true,
					}),
				).toBe("…four");
			});

			test("should handle non-strict for start preserveWords", () => {
				// effective length = 10 - 1 = 9, three (5) + four (4) + sep = 10 >= 9
				expect(
					truncate("one two three four", 10, {
						position: "start",
						preserveWords: true,
						strict: false,
					}),
				).toBe("…three four");
			});
		});
	});

	describe("non-string input", () => {
		test.for([
			["number (positive)", 1],
			["number (zero)", 0],
			["number (NaN)", NaN],
			["boolean (true)", true],
			["boolean (false)", false],
			["array (empty)", []],
			["array (non-empty)", [1, 2]],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(truncate(input)).toBe("");
		});
	});
});
