import { describe, expect, test } from "vite-plus/test";
import { uniqueBy } from "./unique-by";

describe("uniqueBy", () => {
	const sampleArray = [
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
		{ id: 1, name: "Charlie" },
		{ id: 3, name: "Alice" },
	];

	describe("should return an empty array for a non-array", () => {
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
			expect(uniqueBy(input, "id")).toEqual([]);
		});
	});

	describe("should return an empty array for a non-string property", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(uniqueBy(sampleArray, input)).toEqual([]);
		});
	});

	test("should deduplicate by a direct property", () => {
		expect(uniqueBy(sampleArray, "id")).toEqual([
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 3, name: "Alice" },
		]);
	});

	test("should deduplicate by dot-path property", () => {
		const array = [
			{ address: { city: "London" } },
			{ address: { city: "Paris" } },
			{ address: { city: "London" } },
		];

		expect(uniqueBy(array, "address.city")).toEqual([
			{ address: { city: "London" } },
			{ address: { city: "Paris" } },
		]);
	});

	test("should collapse items with undefined value to one (first kept)", () => {
		const array = [{ name: "First" }, { id: 1, name: "With ID" }, { name: "Second" }];

		expect(uniqueBy(array, "id")).toEqual([{ name: "First" }, { id: 1, name: "With ID" }]);
	});

	test("should return a new array when all items are unique", () => {
		const array = [{ id: 1 }, { id: 2 }, { id: 3 }];

		const result = uniqueBy(array, "id");

		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
		expect(result).not.toBe(array);
	});

	test("should return empty array for empty array", () => {
		expect(uniqueBy([], "id")).toEqual([]);
	});

	test("should not mutate the original array", () => {
		const array = [
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Charlie" },
		];

		uniqueBy(array, "id");

		expect(array).toEqual([
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Charlie" },
		]);
	});
});
