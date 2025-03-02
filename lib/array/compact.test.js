import { describe, expect, test } from "vitest";
import { compact } from "./compact";

describe("compact", () => {
	describe("should return an empty array for anything other than a non-empty array", () => {
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
			expect(compact(input)).toEqual([]);
		});
	});

	test("should remove falsy values from the array", () => {
		expect(compact([0, 1, false, 2, "", 3])).toEqual([1, 2, 3]);
		expect(compact([null, "a", undefined, "b", NaN, "c"])).toEqual(["a", "b", "c"]);
		expect(compact([true, false, true, false])).toEqual([true, true]);
	});

	test("should not mutate an array if there are no falsy values", () => {
		expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
		expect(compact(["a", "b", "c"])).toEqual(["a", "b", "c"]);
		expect(compact([true, true, true])).toEqual([true, true, true]);
	});
});
