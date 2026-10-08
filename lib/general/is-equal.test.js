import { isEqual } from "./is-equal";
import { describe, expect, test } from "vite-plus/test";

describe("is-equal", () => {
	describe("should treat equal primitives as equal", () => {
		test.for([
			["string", "hello", "hello"],
			["number", 1, 1],
			["number (zero)", 0, 0],
			["boolean", true, true],
			["NaN", NaN, NaN],
			["null", null, null],
			["undefined", undefined, undefined],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(true);
		});
	});

	describe("should treat differing primitives as unequal", () => {
		test.for([
			["different strings", "hello", "world"],
			["different numbers", 1, 2],
			["null vs undefined", null, undefined],
			["truthy vs falsy", 1, true],
			["number vs string", 1, "1"],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(false);
		});
	});

	describe("should deeply compare arrays", () => {
		test.for([
			["equal primitive arrays", [1, 2, 3], [1, 2, 3]],
			["equal nested arrays", [1, [2, 3]], [1, [2, 3]]],
			["equal arrays of objects", [{ property: "value" }], [{ property: "value" }]],
			["empty arrays", [], []],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(true);
		});

		test.for([
			["different length", [1, 2], [1, 2, 3]],
			["different order", [1, 2], [2, 1]],
			["different nested value", [1, [2, 3]], [1, [2, 4]]],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(false);
		});

		test.for([
			["a hole differs from a number", Array(1), [1], false],
			[
				"a hole equals undefined at the start",
				Object.assign(Array(3), { 1: 1, 2: 2 }),
				[undefined, 1, 2],
				true,
			],
			[
				"a hole equals undefined in the middle",
				Object.assign(Array(3), { 0: 1, 2: 2 }),
				[1, undefined, 2],
				true,
			],
			[
				"a hole equals undefined at the end",
				Object.assign(Array(3), { 0: 1, 1: 2 }),
				[1, 2, undefined],
				true,
			],
			["a nested hole equals undefined", [1, Array(1)], [1, [undefined]], true],
			["a sparse array differs from an empty array", Array(1), [], false],
		])("%s in both orders", ([, a, b, expected]) => {
			expect(isEqual(a, b)).toBe(expected);
			expect(isEqual(b, a)).toBe(expected);
		});
	});

	describe("should deeply compare plain objects", () => {
		test.for([
			["equal objects", { a: 1, b: 2 }, { a: 1, b: 2 }],
			["different key order", { a: 1, b: 2 }, { b: 2, a: 1 }],
			["equal nested objects", { a: { b: 1 } }, { a: { b: 1 } }],
			["equal empty objects", {}, {}],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(true);
		});

		test.for([
			["different value", { a: 1 }, { a: 2 }],
			["different keys", { a: 1 }, { b: 1 }],
			["different key count", { a: 1 }, { a: 1, b: 2 }],
			["nested mismatch", { a: { b: 1 } }, { a: { b: 2 } }],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(false);
		});
	});

	describe("should treat mismatched types as unequal", () => {
		test.for([
			["array vs object", [1, 2], { 0: 1, 1: 2 }],
			["object vs primitive", { a: 1 }, "value"],
			["array vs primitive", [1, 2], "1,2"],
			["object vs null", { a: 1 }, null],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(false);
		});
	});

	describe("should not treat non-plain objects as equal by their enumerable keys", () => {
		test.for([
			["two Date instances with the same value", new Date(2026, 0, 1), new Date(2026, 0, 1)],
			["a Map vs a Map", new Map([["a", 1]]), new Map([["a", 1]])],
			[
				"a class instance vs a plain object with matching keys",
				new (class {
					// Provide a field for object comparison.
					a = 1;
				})(),
				{ a: 1 },
			],
		])("%s", ([, a, b]) => {
			expect(isEqual(a, b)).toBe(false);
		});
	});
});
