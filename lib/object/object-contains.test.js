import { describe, expect, test } from "vitest";
import { objectContains } from "./object-contains";

describe("object-contains", () => {
	describe("should return false when not provided a non-empty object or non-empty array", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (empty)", {}],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(objectContains(input, "string")).toBe(false);
		});
	});

	test("should detect a value within an object", () => {
		expect(objectContains({ name: "Ariel" }, "Ariel")).toBe(true);
	});

	describe("Nesting", () => {
		test("should detect a value within a nested object", () => {
			expect(objectContains({ name: { first: "Ariel" } }, "Ariel")).toBe(true);
		});

		test("should detect a value within a nested array", () => {
			expect(objectContains([["Ariel", "the daughter of King Triton"], ["Merida", "of DunBroch"]], "Merida")).toBe(true);
		});

		test("should detect a value within mixed nesting", () => {
			expect(objectContains([{ names: ["Ariel", "the daughter of King Triton"] }, { names: ["Merida", "of DunBroch"] }], "Merida")).toBe(true);
		});
	});

	describe("Strings", () => {
		test("should allow case insensitive string matches by default", () => {
			expect(objectContains({ name: "Moana" }, "moana")).toBe(true);
		});

		test("should not allow case insensitive string matches when specified", () => {
			expect(objectContains({ name: "Moana" }, "moana", { caseInsensitive: false })).toBe(false);
		});

		test("should not allow partial string matches by default", () => {
			expect(objectContains({ name: "Mulan" }, "Mul")).toBe(false);
		});

		test("should allow partial string matches when specified", () => {
			expect(objectContains({ name: "Mulan" }, "Mul", { allowPartial: true })).toBe(true);
		});
	});

	describe("Exclude", () => {
		test("should allow properties to be excluded", () => {
			expect(objectContains({ name: "Mulan" }, "Mulan", { exclude: ["name"] })).toBe(false);
		});

		test("should ignore unknown properties", () => {
			expect(objectContains({ name: "Mulan" }, "Mulan", { exclude: ["home"] })).toBe(true);
		});
	});

	describe("Include", () => {
		test("should allow properties to be searched exclusively", () => {
			expect(objectContains({ name: "Merida", franchise: "Brave" }, "Brave", { include: ["name"] })).toBe(false);
		});

		test("should ignore unknown properties", () => {
			expect(objectContains({ name: "Merida", franchise: "Brave" }, "Brave", { include: ["franchise", "home"] })).toBe(true);
		});
	});
});
