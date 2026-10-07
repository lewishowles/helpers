import { groupBy } from "./group-by";
import { describe, expect, test } from "vite-plus/test";

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

	test.for(["constructor", "toString", "hasOwnProperty", "__proto__"])(
		"should group repeated %s values under their own key",
		(key) => {
			const items = [
				{ group: key, id: 1 },
				{ group: "other", id: 2 },
				{ group: key, id: 3 },
			];

			const result = groupBy(items, "group");

			expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
			expect(Object.keys(result)).toEqual([key, "other"]);

			expect(Object.getOwnPropertyDescriptor(result, key)).toEqual({
				value: [items[0], items[2]],
				writable: true,
				enumerable: true,
				configurable: true,
			});

			expect(result.other).toEqual([items[1]]);

			expect(items).toEqual([
				{ group: key, id: 1 },
				{ group: "other", id: 2 },
				{ group: key, id: 3 },
			]);
		},
	);

	test('should group missing properties under "undefined"', () => {
		const items = [{ name: "Alice", role: "admin" }, { name: "Bob" }, { name: "Charlie" }];

		expect(groupBy(items, "role")).toEqual({
			admin: [{ name: "Alice", role: "admin" }],
			undefined: [{ name: "Bob" }, { name: "Charlie" }],
		});
	});

	test('should group missing dot-path values under "undefined"', () => {
		const items = [{ details: { group: "admin" } }, { details: {} }, {}];
		const result = groupBy(items, "details.group");

		expect(result).toEqual({
			admin: [items[0]],
			undefined: [items[1], items[2]],
		});

		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
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
