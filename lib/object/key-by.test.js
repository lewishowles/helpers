import { describe, expect, test } from "vitest";
import { keyBy } from "./key-by";

describe("key-by", () => {
	describe("should return an empty object if the array is not a non-empty array", () => {
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
		])("%s", ([, array]) => {
			expect(keyBy(array, "id")).toEqual({});
		});
	});

	describe("should return the original array if the key is not a non-empty string", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, key]) => {
			const array = [{ id: 1 }, { id: 2 }];

			expect(keyBy(array, key)).toEqual(array);
		});
	});

	test("should key the array items by the given key", () => {
		const array = [
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 3, name: "Charlie" },
		];

		const expected = {
			1: { id: 1, name: "Alice" },
			2: { id: 2, name: "Bob" },
			3: { id: 3, name: "Charlie" },
		};

		expect(keyBy(array, "id")).toEqual(expected);
	});

	test("should discard objects without the given key", () => {
		const array = [
			{ id: 1, name: "Alice" },
			{ name: "Bob" },
			{ id: 3, name: "Charlie" },
		];

		const expected = {
			1: { id: 1, name: "Alice" },
			3: { id: 3, name: "Charlie" },
		};

		expect(keyBy(array, "id")).toEqual(expected);
	});

	test("should overwrite objects with the same key", () => {
		const array = [
			{ id: 1, name: "Alice" },
			{ id: 1, name: "Bob" },
			{ id: 3, name: "Charlie" },
		];

		const expected = {
			1: { id: 1, name: "Bob" },
			3: { id: 3, name: "Charlie" },
		};

		expect(keyBy(array, "id")).toEqual(expected);
	});
});
