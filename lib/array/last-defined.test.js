import { describe, expect, test } from "vitest";
import { lastDefined } from "./last-defined";

describe("first-defined", () => {
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
			expect(lastDefined(input)).toBe(undefined);
		});
	});

	test("should return the last defined item", () => {
		expect(lastDefined(["a", "b"])).toBe("b");
		expect(lastDefined(["a", undefined])).toBe("a");
		expect(lastDefined(["a", "b", undefined, undefined])).toBe("b");
	});
});
