import { describe, expect, test } from "vitest";
import { tail } from "./tail";

describe("tail", () => {
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
			expect(tail(input)).toBe(undefined);
		});
	});

	test("should return the last element", () => {
		expect(tail(["a", "b"])).toBe("b");
	});

	test("should return undefined for an empty array", () => {
		expect(tail([])).toBe(undefined);
	});
});
