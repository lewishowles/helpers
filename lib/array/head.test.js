import { describe, expect, test } from "vitest";
import { head } from "./head";

describe("head", () => {
	describe("should return undefined for a non-array", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(head(input)).toBe(undefined);
		});
	});

	test("should return the first element", () => {
		expect(head(["a", "b"])).toBe("a");
	});

	test("should return undefined for an empty array", () => {
		expect(head([])).toBe(undefined);
	});
});
