import { describe, expect, test } from "vite-plus/test";
import { moveItem } from "./move-item";

describe("moveItem", () => {
	describe("should return an empty array for non-array input", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(moveItem(input, 0, 1)).toEqual([]);
		});
	});

	describe("invalid fromIndex", () => {
		const input = ["a", "b", "c", "d"];

		test("NaN returns a shallow clone", () => {
			const result = moveItem(input, NaN, 1);

			expect(result).toEqual(input);
			expect(result).not.toBe(input);
		});

		test("non-integer (1.5) returns a shallow clone", () => {
			expect(moveItem(input, 1.5, 1)).toEqual(input);
		});

		test("string returns a shallow clone", () => {
			expect(moveItem(input, "1", 1)).toEqual(input);
		});

		test("undefined returns a shallow clone", () => {
			expect(moveItem(input, undefined, 1)).toEqual(input);
		});

		test("negative (-1) returns a shallow clone", () => {
			expect(moveItem(input, -1, 1)).toEqual(input);
		});

		test("out of bounds (>= length) returns a shallow clone", () => {
			expect(moveItem(input, 4, 1)).toEqual(input);
		});

		test("Infinity returns a shallow clone", () => {
			expect(moveItem(input, Infinity, 1)).toEqual(input);
		});
	});

	describe("invalid toIndex", () => {
		const input = ["a", "b", "c", "d"];

		test("NaN returns a shallow clone", () => {
			expect(moveItem(input, 1, NaN)).toEqual(input);
		});

		test("non-integer (1.5) returns a shallow clone", () => {
			expect(moveItem(input, 1, 1.5)).toEqual(input);
		});

		test("string returns a shallow clone", () => {
			expect(moveItem(input, 1, "1")).toEqual(input);
		});

		test("undefined returns a shallow clone", () => {
			expect(moveItem(input, 1, undefined)).toEqual(input);
		});

		test("Infinity returns a shallow clone", () => {
			expect(moveItem(input, 1, Infinity)).toEqual(input);
		});
	});

	describe("toIndex clamping", () => {
		const input = ["a", "b", "c", "d"];

		test("toIndex too large (finite integer >= length) clamps to last position", () => {
			expect(moveItem(input, 0, 100)).toEqual(["b", "c", "d", "a"]);
		});

		test("toIndex negative finite integer clamps to 0", () => {
			expect(moveItem(input, 3, -3)).toEqual(["d", "a", "b", "c"]);
		});
	});

	describe("fromIndex equals toIndex", () => {
		test("same index returns a clone with identical content", () => {
			const input = ["a", "b", "c", "d"];
			const result = moveItem(input, 1, 1);

			expect(result).toEqual(input);
			expect(result).not.toBe(input);
		});
	});

	describe("valid moves", () => {
		test("move forward (1 to 3)", () => {
			expect(moveItem(["a", "b", "c", "d"], 1, 3)).toEqual(["a", "c", "d", "b"]);
		});

		test("move backward (3 to 1)", () => {
			expect(moveItem(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"]);
		});

		test("move to start (2 to 0)", () => {
			expect(moveItem(["a", "b", "c", "d"], 2, 0)).toEqual(["c", "a", "b", "d"]);
		});

		test("move to end (0 to length - 1)", () => {
			expect(moveItem(["a", "b", "c", "d"], 0, 3)).toEqual(["b", "c", "d", "a"]);
		});
	});

	describe("edge cases", () => {
		test("single-element array returns a clone", () => {
			const input = ["a"];
			const result = moveItem(input, 0, 0);

			expect(result).toEqual(input);
			expect(result).not.toBe(input);
		});

		test("two-element array swap", () => {
			expect(moveItem(["a", "b"], 0, 1)).toEqual(["b", "a"]);
		});

		test("original array is not mutated", () => {
			const input = ["a", "b", "c", "d"];
			const result = moveItem(input, 0, 3);

			expect(input).toEqual(["a", "b", "c", "d"]);
			expect(result).not.toBe(input);
		});
	});
});
