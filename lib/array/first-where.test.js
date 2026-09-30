import { firstWhere } from "./first-where";
import { describe, expect, test } from "vite-plus/test";

describe("firstWhere", () => {
	const users = [
		{ name: "Alice", role: "admin", active: true },
		{ name: "Bob", role: "user", active: false },
		{ name: "Charlie", role: "admin", active: false },
		{ name: "Dana", role: "user", active: true },
	];

	describe("should return undefined for a non-array", () => {
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
			expect(firstWhere(input, () => true)).toBeUndefined();
		});
	});

	describe("should return undefined for an invalid matcher", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(firstWhere(users, input)).toBeUndefined();
		});
	});

	test("should return an empty array for an empty array", () => {
		expect(firstWhere([], () => true)).toBeUndefined();
	});

	describe("predicate form", () => {
		test("should return the first item matching the predicate", () => {
			expect(firstWhere(users, (user) => user.role === "admin")).toEqual({
				name: "Alice",
				role: "admin",
				active: true,
			});
		});

		test("should return undefined when no item matches the predicate", () => {
			expect(firstWhere(users, (user) => user.role === "editor")).toBeUndefined();
		});

		test("should pass (item, index, array) to the predicate", () => {
			const result = firstWhere(users, (user, index, array) => {
				return index === 2 && array.length === 4 && user.name === "Charlie";
			});

			expect(result).toEqual({ name: "Charlie", role: "admin", active: false });
		});
	});

	describe("filter-object form", () => {
		test("should return the first item matching all filter pairs", () => {
			expect(firstWhere(users, { role: "admin", active: false })).toEqual({
				name: "Charlie",
				role: "admin",
				active: false,
			});
		});

		test("should return the first item matching a single filter pair", () => {
			expect(firstWhere(users, { role: "user" })).toEqual({
				name: "Bob",
				role: "user",
				active: false,
			});
		});

		test("should return undefined when no item matches all filter pairs", () => {
			expect(firstWhere(users, { role: "admin", active: true, name: "Bob" })).toBeUndefined();
		});

		test("should support dot-path notation for nested properties", () => {
			const orders = [
				{ id: 1, customer: { city: "York" } },
				{ id: 2, customer: { city: "Leeds" } },
				{ id: 3, customer: { city: "York" } },
			];

			expect(firstWhere(orders, { "customer.city": "York" })).toEqual({
				id: 1,
				customer: { city: "York" },
			});
		});

		test("should require all filter pairs to match (AND logic)", () => {
			const result = firstWhere(users, { role: "user", active: true });

			expect(result).toEqual({ name: "Dana", role: "user", active: true });
		});

		test("should use strict equality for matching", () => {
			const items = [{ count: 1 }, { count: "1" }];

			expect(firstWhere(items, { count: 1 })).toEqual({ count: 1 });
		});
	});
});
