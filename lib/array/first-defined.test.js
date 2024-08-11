import { describe, expect, test } from "vitest";
import { firstDefined } from "./first-defined";

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
			expect(firstDefined(input)).toBe(undefined);
		});
	});

	test("should return the first defined item", () => {
		expect(firstDefined(["a", "b"])).toBe("a");
		expect(firstDefined([undefined, "b"])).toBe("b");
		expect(firstDefined([undefined, undefined, "b", "c"])).toBe("b");
	});
});
