import { describe, expect, test } from "vite-plus/test";
import { flattenObject } from "./flatten-object";

describe("flattenObject", () => {
	describe("should return an empty object for non-object input", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(flattenObject(input)).toEqual({});
		});
	});

	test("should flatten a nested object with dot-notation keys", () => {
		expect(
			flattenObject({
				a: {
					b: 1,
					c: {
						d: 2,
					},
				},
				e: 3,
			}),
		).toEqual({
			"a.b": 1,
			"a.c.d": 2,
			e: 3,
		});
	});

	test("should preserve arrays as leaf values", () => {
		expect(
			flattenObject({
				items: [1, 2, 3],
				nested: {
					list: ["a", "b"],
				},
			}),
		).toEqual({
			items: [1, 2, 3],
			"nested.list": ["a", "b"],
		});
	});

	test("should handle mixed shallow and deep properties", () => {
		expect(
			flattenObject({
				name: "Sophie",
				address: {
					city: "London",
					postcode: "SW1A 1AA",
				},
			}),
		).toEqual({
			name: "Sophie",
			"address.city": "London",
			"address.postcode": "SW1A 1AA",
		});
	});

	test("should return an empty object for an empty object", () => {
		expect(flattenObject({})).toEqual({});
	});

	test("should handle null and undefined values as leaf values", () => {
		expect(
			flattenObject({
				a: null,
				b: {
					c: undefined,
				},
			}),
		).toEqual({
			a: null,
			"b.c": undefined,
		});
	});

	test("should not modify the original object", () => {
		const original = { a: { b: 1 } };

		flattenObject(original);

		expect(original).toEqual({ a: { b: 1 } });
	});
});
