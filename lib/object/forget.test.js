import { describe, expect, test } from "vitest";
import { forget } from "./forget";

describe("forget", () => {
	describe("should return the original input if it is not an object", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
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
			expect(forget(input, "key")).toBe(input);
		});
	});

	test("should return a copy of the object if `path` is not a non-empty string", () => {
		const object = { key: "value" };
		const result = forget(object, "");

		expect(result).toEqual(object);
		expect(result).not.toBe(object);
	});

	test("should remove a top-level key from the object", () => {
		const object = { key: "value", anotherKey: "anotherValue" };
		const result = forget(object, "key");

		expect(result).toEqual({ anotherKey: "anotherValue" });
	});

	test("should remove a nested key from the object", () => {
		const object = { key: { nestedKey: "nestedValue", anotherNestedKey: "anotherNestedValue" } };
		const result = forget(object, "key.nestedKey");

		expect(result).toEqual({ key: { anotherNestedKey: "anotherNestedValue" } });
	});

	test("should handle non-existent keys gracefully", () => {
		const object = { key: "value" };
		const result = forget(object, "nonExistentKey");

		expect(result).toEqual(object);
		expect(result).not.toBe(object);
	});

	test("should handle non-existent paths gracefully", () => {
		const object = { key: "value" };
		const result = forget(object, "key.nonExistentKey");

		expect(result).toEqual(object);
		expect(result).not.toBe(object);
	});

	test("should not modify the original object", () => {
		const object = { key: "value" };
		const result = forget(object, "key");

		expect(result).not.toBe(object);
		expect(object).toEqual({ key: "value" });
	});
});
