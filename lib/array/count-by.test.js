import { countBy } from "./count-by";
import { describe, expect, test } from "vite-plus/test";

describe("countBy", () => {
	const people = [
		{ name: "Alice", role: "admin" },
		{ name: "Bob", role: "user" },
		{ name: "Charlie", role: "admin" },
		{ name: "Dana", role: "user" },
	];

	describe("should return an empty object for a non-array", () => {
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
			expect(countBy(input, "role")).toEqual({});
		});
	});

	describe("should return an empty object for a non-string property", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
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
			expect(countBy(people, input)).toEqual({});
		});
	});

	test("should count occurrences by a direct property", () => {
		expect(countBy(people, "role")).toEqual({
			admin: 2,
			user: 2,
		});
	});

	test("should count occurrences by a dot-path property", () => {
		const items = [
			{ address: { city: "York" } },
			{ address: { city: "York" } },
			{ address: { city: "Leeds" } },
		];

		expect(countBy(items, "address.city")).toEqual({
			York: 2,
			Leeds: 1,
		});
	});

	test('should count missing properties under "undefined"', () => {
		const items = [{ name: "Alice", role: "admin" }, { name: "Bob" }, { name: "Charlie" }];

		expect(countBy(items, "role")).toEqual({
			admin: 1,
			undefined: 2,
		});
	});

	test("should return an empty object for an empty array", () => {
		expect(countBy([], "role")).toEqual({});
	});

	test("should return counts of 1 when all values are distinct", () => {
		const items = [
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "user" },
			{ name: "Charlie", role: "editor" },
		];

		expect(countBy(items, "role")).toEqual({
			admin: 1,
			user: 1,
			editor: 1,
		});
	});

	test("should count all items under a single key when all values are the same", () => {
		const items = [
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "admin" },
			{ name: "Charlie", role: "admin" },
		];

		expect(countBy(items, "role")).toEqual({
			admin: 3,
		});
	});

	test("should count a single item", () => {
		expect(countBy([{ name: "Alice", role: "admin" }], "role")).toEqual({
			admin: 1,
		});
	});

	test("should not modify the original array", () => {
		const original = [
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "user" },
		];

		countBy(original, "role");

		expect(original).toEqual([
			{ name: "Alice", role: "admin" },
			{ name: "Bob", role: "user" },
		]);
	});
});
