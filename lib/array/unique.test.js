import { describe, expect, test } from "vitest";
import { unique } from "./unique";

describe("unique", () => {
	test("should return unique elements from an array", () => {
		const input = [1, 2, 2, 3, 4, 4, 5];
		const output = unique(input);

		expect(output).toEqual([1, 2, 3, 4, 5]);
	});

	describe("should discard anything but a non-empty array of values", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(unique(input)).toEqual([]);
		});
	});
});
