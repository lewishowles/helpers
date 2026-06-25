import { describe, expect, test } from "vite-plus/test";
import { toggleItem } from "./toggle-item";

describe("toggleItem", () => {
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
			expect(toggleItem(input, 1)).toEqual([]);
		});
	});

	describe("without a comparator", () => {
		test("should add an item that is not present", () => {
			expect(toggleItem([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
		});

		test("should remove an item that is present", () => {
			expect(toggleItem([1, 2, 3], 2)).toEqual([1, 3]);
		});

		test("should remove all occurrences when the item appears multiple times", () => {
			expect(toggleItem([1, 2, 2, 3], 2)).toEqual([1, 3]);
		});

		test("should use strict equality for matching", () => {
			expect(toggleItem([1, 2, 3], "2")).toEqual([1, 2, 3, "2"]);
		});

		test("should add an object when no matching reference exists", () => {
			const a = { id: 1 };
			const b = { id: 2 };

			expect(toggleItem([a], b)).toEqual([a, b]);
		});

		test("should remove an object by reference", () => {
			const a = { id: 1 };
			const b = { id: 2 };

			expect(toggleItem([a, b], a)).toEqual([b]);
		});
	});

	describe("with a function comparator", () => {
		const byId = (a, b) => a.id === b.id;

		test("should add an item when the comparator finds no match", () => {
			const existing = [{ id: 1 }, { id: 2 }];
			const item = { id: 3 };

			expect(toggleItem(existing, item, byId)).toEqual([...existing, item]);
		});

		test("should remove items when the comparator finds a match", () => {
			const existing = [{ id: 1 }, { id: 2 }];
			const item = { id: 1 };

			expect(toggleItem(existing, item, byId)).toEqual([{ id: 2 }]);
		});

		test("should remove all matching items", () => {
			const existing = [{ id: 1 }, { id: 2 }, { id: 1 }];
			const item = { id: 1 };

			expect(toggleItem(existing, item, byId)).toEqual([{ id: 2 }]);
		});
	});

	describe("with a key comparator", () => {
		test("should add an item when no match is found by key", () => {
			const existing = [{ id: 1 }, { id: 2 }];
			const item = { id: 3 };

			expect(toggleItem(existing, item, "id")).toEqual([...existing, item]);
		});

		test("should remove items matched by key", () => {
			const existing = [{ id: 1 }, { id: 2 }];
			const item = { id: 1 };

			expect(toggleItem(existing, item, "id")).toEqual([{ id: 2 }]);
		});

		test("should remove all items matched by key", () => {
			const existing = [{ id: 1 }, { id: 2 }, { id: 1 }];
			const item = { id: 1 };

			expect(toggleItem(existing, item, "id")).toEqual([{ id: 2 }]);
		});
	});
});
