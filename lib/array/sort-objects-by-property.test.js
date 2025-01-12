import { describe, expect, test } from "vitest";
import { sortObjectsByProperty } from "./sort-objects-by-property";

describe("sort-objects-by-property", () => {
	describe("should not attempt to sort a non-array", () => {
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
			expect(sortObjectsByProperty(input, "name")).toEqual(input);
		});
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

			expect(sortObjectsByProperty(array, input)).toEqual(array);
		});
	});

	test("should sort objects in an array", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

		expect(sortObjectsByProperty(array, "name")).toEqual([
			{ name: "Alice" },
			{ name: "Lewis" },
			{ name: "Sophie" },
		]);
	});

	test("should sort objects in an array in reverse", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }];

		expect(sortObjectsByProperty(array, "name", { ascending: false })).toEqual([
			{ name: "Sophie" },
			{ name: "Lewis" },
			{ name: "Alice" },
		]);
	});

	test("should account for invalid values", () => {
		const array = [{ name: "Sophie" }, { name: "Lewis" }, { name: "Alice" }, { name: null }, { name: undefined }];

		expect(sortObjectsByProperty(array, "name")).toEqual([
			{ name: null },
			{ name: undefined },
			{ name: "Alice" },
			{ name: "Lewis" },
			{ name: "Sophie" },
		]);
	});
});
