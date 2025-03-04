import { describe, expect, test } from "vitest";
import { set } from "./set";

describe("set", () => {
	test("should set a value at a shallow path", () => {
		const object = { a: 1 };
		const result = set(object, "b", 2);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("should set a value at a deep path", () => {
		const object = { a: { b: { c: 1 } } };
		const result = set(object, "a.b.d", 2);

		expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
	});

	test("should create nested objects as necessary", () => {
		const object = {};
		const result = set(object, "a.b.c", 1);

		expect(result).toEqual({ a: { b: { c: 1 } } });
	});

	test("should not modify the original object", () => {
		const object = { a: 1 };
		const result = set(object, "b", 2);

		expect(object).toEqual({ a: 1 });
		expect(result).toEqual({ a: 1, b: 2 });
	});

	describe("should return the original object if `path` is not a non-empty string", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			const object = { a: 1 };
			const result = set(object, input, 2);

			expect(result).toEqual(object);
		});
	});

	describe("should return the original input when detecting a non-object", () => {
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
			const result = set(input, "a", 2);

			expect(result).toBe(input);
		});
	});

	test("should not modify the object if a part of the path is not an object", () => {
		const object = { a: 1 };
		const result = set(object, "a.b", 2);

		expect(result).toEqual({ a: 1 });
	});
});
