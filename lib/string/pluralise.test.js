import { pluralise } from "./pluralise";
import { describe, expect, test } from "vite-plus/test";

describe("pluralise", () => {
	describe("should return the singular form", () => {
		test.for([
			["number one", 1],
			["numeric string", "1"],
			["padded numeric string", " 1 "],
			["hexadecimal string", "0x1"],
			["decimal string equal to one", "1.0"],
		])("%s", ([, count]) => {
			expect(pluralise(count, "item")).toBe("item");
		});
	});

	describe("should return the plural form", () => {
		test.for([
			["zero", 0],
			["negative one", -1],
			["two", 2],
			["decimal", 1.5],
			["numeric string above one", "2"],
		])("%s", ([, count]) => {
			expect(pluralise(count, "item")).toBe("items");
		});
	});

	describe("should return the plural form for an invalid count", () => {
		test.for([
			["non-numeric string", "abc"],
			["null", null],
			["undefined", undefined],
			["NaN", NaN],
			["Infinity", Infinity],
		])("%s", ([, count]) => {
			expect(pluralise(count, "item")).toBe("items");
		});
	});

	describe("should use the given plural", () => {
		test("when the count is not one", () => {
			expect(pluralise(2, "person", "people")).toBe("people");
		});

		test("but returns the singular when the count is one", () => {
			expect(pluralise(1, "person", "people")).toBe("person");
		});
	});

	describe("should add s to the singular when the plural is omitted or invalid", () => {
		test.for([
			["omitted", undefined],
			["empty string", ""],
			["number", 5],
			["null", null],
		])("%s", ([, plural]) => {
			expect(pluralise(2, "item", plural)).toBe("items");
		});
	});

	describe("should return an empty string when the singular is invalid", () => {
		test.for([
			["empty string", ""],
			["undefined", undefined],
			["number", 1],
			["null", null],
		])("%s", ([, singular]) => {
			expect(pluralise(1, singular)).toBe("");
			expect(pluralise(2, singular, "things")).toBe("");
		});
	});
});
