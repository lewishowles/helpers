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
