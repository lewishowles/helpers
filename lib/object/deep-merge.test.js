import { describe, expect, test } from "vitest";
import { deepMerge } from "./deep-merge";

describe("deep-merge", () => {
	test("should merge two objects deeply", () => {
		const target = { a: 1, b: { c: 2 } };
		const source = { b: { d: 3 }, e: 4 };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	test("should merge multiple objects deeply", () => {
		const target = { a: 1 };
		const first = { b: { c: 2 } };
		const second = { b: { d: 3 }, e: 4 };
		const result = deepMerge(target, first, second);

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	test("should handle nested objects", () => {
		const target = { a: { b: { c: 1 } } };
		const source = { a: { b: { d: 2 } } };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
	});

	test("should handle mismatched types", () => {
		const target = {
			a: ["A", "B", "C"],
			e: 5,
			f: "F",
			g: [],
		};

		const source = {
			a: { b: "B", c: "C", d: "D" },
			e: "E",
			f: 7,
			g: {},
		};

		const result = deepMerge(target, source);

		expect(result).toEqual({
			a: { b: "B", c: "C", d: "D" },
			e: "E",
			f: 7,
			g: {},
		});
	});

	test("should not mutate the target object", () => {
		const target = { a: 1 };
		const source = { b: 2 };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: 1, b: 2 });
		expect(target).toEqual({ a: 1 });
	});

	test("should return the target object if no sources are provided", () => {
		const target = { a: 1 };
		const result = deepMerge(target);

		expect(result).toEqual({ a: 1 });
	});
});
