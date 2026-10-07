import { chunk } from "./chunk";
import { describe, expect, test } from "vite-plus/test";

describe("chunk", () => {
	describe("should return an empty array if the input is not a non-empty array", () => {
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
			expect(chunk(input, 2)).toEqual([]);
		});
	});

	describe("should return an empty array for an invalid chunk size", () => {
		test.for([
			["zero", 0],
			["negative zero", -0],
			["negative integer", -1],
			["positive fraction", 0.5],
			["negative fraction", -0.5],
			["NaN", NaN],
			["positive infinity", Infinity],
			["negative infinity", -Infinity],
			["boolean (true)", true],
			["boolean (false)", false],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, chunkSize]) => {
			// The array throws if chunk starts slicing it, so a missing size
			// check fails at once instead of looping forever.
			const array = [1, 2, 3];

			array.slice = () => {
				throw new Error("slice called for an invalid chunk size");
			};

			expect(chunk(array, chunkSize)).toEqual([]);
		});
	});

	test("should split an array into chunks of the specified size", () => {
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);

		expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
			[1, 2, 3],
			[4, 5],
		]);

		expect(chunk([1, 2, 3, 4, 5], 1)).toEqual([[1], [2], [3], [4], [5]]);
	});

	test("should handle a chunkSize larger than the array length", () => {
		expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
	});

	test("should handle a chunkSize that is equal to the array length", () => {
		expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
	});
});
