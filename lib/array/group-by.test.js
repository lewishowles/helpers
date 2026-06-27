import { describe, expect, test } from "vite-plus/test";
import { groupBy } from "./group-by";

describe("groupBy", () => {
	const people = [
		{ name: "Alice", role: "admin" },
		{ name: "Bob", role: "user" },
		{ name: "Charlie", role: "admin" },
		{ name: "Dana", role: "user" },
	];

	describe("should return an empty object for a non-array", () => {
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
			expect(groupBy(input, "role")).toEqual({});
		});
	});

	describe("should return an empty object for a non-string property", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(groupBy(people, input)).toEqual({});
		});
	});

	test("should group by a direct property", () => {
		expect(groupBy(people, "role")).toEqual({
			admin: [
				{ name: "Alice", role: "admin" },
				{ name: "Charlie", role: "admin" },
			],
			user: [
				{ name: "Bob", role: "user" },
				{ name: "Dana", role: "user" },
			],
		});
	});

	test("should group by a dot-path property", () => {
		const items = [
			{ address: { city: "York" } },
			{ address: { city: "York" } },
			{ address: { city: "Leeds" } },
		];

		expect(groupBy(items, "address.city")).toEqual({
			York: [{ address: { city: "York" } }, { address: { city: "York" } }],
			Leeds: [{ address: { city: "Leeds" } }],
		});
	});

	test('should group missing properties under "undefined"', () => {
		const items = [{ name: "Alice", role: "admin" }, { name: "Bob" }, { name: "Charlie" }];

		expect(groupBy(items, "role")).toEqual({
			admin: [{ name: "Alice", role: "admin" }],
			undefined: [{ name: "Bob" }, { name: "Charlie" }],
		});
	});

	test("should return an empty object for an empty array", () => {
		expect(groupBy([], "role")).toEqual({});
	});

	test("should not modify the original array", () => {
		const original = [
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "user" },
		];

		groupBy(original, "role");

		expect(original).toEqual([
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "user" },
		]);
	});
});
