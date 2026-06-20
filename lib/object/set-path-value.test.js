import { describe, expect, test } from "vite-plus/test";
import { setPathValue } from "./set-path-value";

describe("setPathValue", () => {
	test("should set a value at a shallow path", () => {
		const object = { a: 1 };
		const result = setPathValue(object, "b", 2);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("should set a value at a deep path", () => {
		const object = { a: { b: { c: 1 } } };
		const result = setPathValue(object, "a.b.d", 2);

		expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
	});

	test("should create nested objects as necessary", () => {
		const object = {};
		const result = setPathValue(object, "a.b.c", 1);

		expect(result).toEqual({ a: { b: { c: 1 } } });
	});

	test("should not modify the original object", () => {
		const object = { a: 1 };
		const result = setPathValue(object, "b", 2);

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
			const result = setPathValue(object, input, 2);

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
			const result = setPathValue(input, "a", 2);

			expect(result).toBe(input);
		});
	});

	test("should not modify the object if a part of the path is not an object", () => {
		const object = { a: 1 };
		const result = setPathValue(object, "a.b", 2);

		expect(result).toEqual({ a: 1 });
	});

	test("should set a value inside a nested array using a numeric segment", () => {
		const object = { users: [{ name: "Sophie" }, { name: "Maisie" }] };
		const result = setPathValue(object, "users.0.name", "Lily");

		expect(result).toEqual({ users: [{ name: "Lily" }, { name: "Maisie" }] });
	});

	test("should not modify the original array when setting through it", () => {
		const object = { users: [{ name: "Sophie" }] };

		setPathValue(object, "users.0.name", "Lily");

		expect(object).toEqual({ users: [{ name: "Sophie" }] });
	});

	test("should make no changes when a non-integer segment is applied to an array", () => {
		const object = { items: ["a", "b"] };
		const result = setPathValue(object, "items.name", "value");

		expect(result).toEqual({ items: ["a", "b"] });
	});
});
