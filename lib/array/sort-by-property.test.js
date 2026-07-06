import { describe, expect, test } from "vite-plus/test";
import { sortByProperty } from "./sort-by-property";

describe("sortByProperty", () => {
	describe("should return an empty array for any non-arrays", () => {
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
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(sortByProperty(input, "name")).toEqual([]);
			expect(sortByProperty(input, [{ property: "name", ascending: true }])).toEqual([]);
		});
	});

	test("should return an empty array for an empty array", () => {
		expect(sortByProperty([], "name")).toEqual([]);
	});

	describe("should not attempt to sort an array if an invalid property name is provided", () => {
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
		])("%s", ([, input]) => {
			const array = [{ name: "Sophie" }, { name: "Lewis" }];

			expect(sortByProperty(array, input)).toEqual(array);
		});
	});

	describe("multi-criteria sorting", () => {
		test("should sort by multiple properties in ascending order", () => {
			const array = [
				{ last: "Smith", first: "Alice" },
				{ last: "Jones", first: "Bob" },
				{ last: "Smith", first: "Bob" },
				{ last: "Jones", first: "Alice" },
			];

			expect(
				sortByProperty(array, [
					{ property: "last", ascending: true },
					{ property: "first", ascending: true },
				]),
			).toEqual([
				{ last: "Jones", first: "Alice" },
				{ last: "Jones", first: "Bob" },
				{ last: "Smith", first: "Alice" },
				{ last: "Smith", first: "Bob" },
			]);
		});

		test("should sort by multiple properties with mixed ascending and descending", () => {
			const array = [
				{ last: "Smith", first: "Alice" },
				{ last: "Jones", first: "Bob" },
				{ last: "Smith", first: "Bob" },
				{ last: "Jones", first: "Alice" },
			];

			expect(
				sortByProperty(array, [
					{ property: "last", ascending: true },
					{ property: "first", ascending: false },
				]),
			).toEqual([
				{ last: "Jones", first: "Bob" },
				{ last: "Jones", first: "Alice" },
				{ last: "Smith", first: "Bob" },
				{ last: "Smith", first: "Alice" },
			]);
		});

		test("should handle null values in one of the criteria", () => {
			const array = [
				{ last: "Smith", first: "Alice" },
				{ last: "Jones", first: null },
				{ last: "Smith", first: "Bob" },
				{ last: "Jones", first: "Alice" },
			];

			expect(
				sortByProperty(array, [
					{ property: "last", ascending: true },
					{ property: "first", ascending: true },
				]),
			).toEqual([
				{ last: "Jones", first: null },
				{ last: "Jones", first: "Alice" },
				{ last: "Smith", first: "Alice" },
				{ last: "Smith", first: "Bob" },
			]);
		});

		test("should handle non-comparable values by deferring to the next criterion", () => {
			const array = [
				{ last: "Smith", first: "Alice", age: 30 },
				{ last: "Smith", first: "Alice", age: 25 },
			];

			expect(
				sortByProperty(array, [
					{ property: "last", ascending: true },
					{ property: "first", ascending: true },
					{ property: "age", ascending: true },
				]),
			).toEqual([
				{ last: "Smith", first: "Alice", age: 25 },
				{ last: "Smith", first: "Alice", age: 30 },
			]);
		});

		test("should sort by a single criterion via the multi-criteria form", () => {
			const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

			expect(sortByProperty(array, [{ property: "name", ascending: true }])).toEqual([
				{ name: "Alice" },
				{ name: "Lewis" },
				{ name: "Sophie" },
			]);
		});

		test("should return the original array for an empty criteria array", () => {
			const array = [{ name: "Sophie" }, { name: "Lewis" }];

			expect(sortByProperty(array, [])).toEqual(array);
		});

		test("should skip criteria with invalid property names", () => {
			const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

			expect(
				sortByProperty(array, [
					{ property: "", ascending: true },
					{ property: "name", ascending: true },
				]),
			).toEqual([{ name: "Alice" }, { name: "Lewis" }, { name: "Sophie" }]);
		});

		test("should return the original array when all criteria have invalid property names", () => {
			const array = [{ name: "Sophie" }, { name: "Lewis" }];

			expect(
				sortByProperty(array, [{ property: "", ascending: true }, { ascending: true }]),
			).toEqual(array);
		});

		test("should treat a missing ascending field as ascending", () => {
			const array = [{ name: "Sophie" }, { name: "Alice" }];
			const result = sortByProperty(array, [{ property: "name" }]);

			expect(result).toEqual([{ name: "Alice" }, { name: "Sophie" }]);
		});

		test("should not mutate the original array when sorting by multiple criteria", () => {
			const array = [
				{ last: "Smith", first: "Alice" },
				{ last: "Jones", first: "Bob" },
			];

			expect(
				sortByProperty(array, [
					{ property: "last", ascending: null },
					{ property: "first", ascending: true },
				]),
			).toEqual([
				{ last: "Jones", first: "Bob" },
				{ last: "Smith", first: "Alice" },
			]);

			expect(array[0].last).toBe("Smith");
		});
	});

	test("should sort objects in an array", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

		expect(sortByProperty(array, "name")).toEqual([
			{ name: "Alice" },
			{ name: "Lewis" },
			{ name: "Sophie" },
		]);
	});

	test("should not mutate the original array", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

		expect(sortByProperty(array, "name")).toEqual([
			{ name: "Alice" },
			{ name: "Lewis" },
			{ name: "Sophie" },
		]);

		expect(array[0].name).toBe("Sophie");
	});

	test("should sort objects in an array in reverse", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

		expect(sortByProperty(array, "name", { ascending: false })).toEqual([
			{ name: "Sophie" },
			{ name: "Lewis" },
			{ name: "Alice" },
		]);
	});

	test("should account for invalid values", () => {
		const array = [
			{ name: "Sophie" },
			{ name: "Lewis" },
			{ name: "Alice" },
			{ name: null },
			{ name: undefined },
		];

		expect(sortByProperty(array, "name")).toEqual([
			{ name: null },
			{ name: undefined },
			{ name: "Alice" },
			{ name: "Lewis" },
			{ name: "Sophie" },
		]);
	});
});
