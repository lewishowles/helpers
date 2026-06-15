import { describe, expect, test } from "vite-plus/test";
import { NOT_FOUND, traversePath } from "./path-traversal";

describe("path-traversal", () => {
	describe("traversePath", () => {
		test("should retrieve a top-level property from an object", () => {
			expect(traversePath({ name: "Sophie" }, ["name"])).toBe("Sophie");
		});

		test("should retrieve a nested property from an object", () => {
			expect(traversePath({ a: { b: { c: 1 } } }, ["a", "b", "c"])).toBe(1);
		});

		test("should retrieve an element from an array", () => {
			expect(traversePath(["a", "b", "c"], ["1"])).toBe("b");
		});

		test("should traverse through a nested array", () => {
			expect(traversePath({ users: [{ name: "Sophie" }] }, ["users", "0", "name"])).toBe("Sophie");
		});

		test("should return NOT_FOUND for a missing object key", () => {
			expect(traversePath({ a: 1 }, ["b"])).toBe(NOT_FOUND);
		});

		test("should return NOT_FOUND for a missing nested key", () => {
			expect(traversePath({ a: { b: 1 } }, ["a", "c"])).toBe(NOT_FOUND);
		});

		test("should return NOT_FOUND for a non-integer segment on an array", () => {
			expect(traversePath([1, 2, 3], ["name"])).toBe(NOT_FOUND);
		});

		test("should return NOT_FOUND for an out-of-bounds array index", () => {
			expect(traversePath(["a", "b"], ["5"])).toBe(NOT_FOUND);
		});

		test("should return NOT_FOUND when traversal reaches a primitive", () => {
			expect(traversePath({ a: 1 }, ["a", "b"])).toBe(NOT_FOUND);
		});

		test("should return NOT_FOUND when traversal reaches null", () => {
			expect(traversePath({ a: null }, ["a", "b"])).toBe(NOT_FOUND);
		});

		test("should return the value itself for an empty segment list", () => {
			expect(traversePath({ a: 1 }, [])).toEqual({ a: 1 });
		});

		test("should return a value of undefined when the key exists but holds undefined", () => {
			expect(traversePath({ a: undefined }, ["a"])).toBeUndefined();
		});

		test("should traverse through an empty object when the key is absent", () => {
			expect(traversePath({}, ["a"])).toBe(NOT_FOUND);
		});
	});
});
