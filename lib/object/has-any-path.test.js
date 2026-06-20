import { describe, expect, test } from "vite-plus/test";
import { hasAnyPath } from "./has-any-path";

describe("hasAnyPath", () => {
	describe("should return false if the input is not a non-empty object", () => {
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
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(hasAnyPath(input, ["a"])).toBe(false);
		});
	});

	describe("should return false if `paths` is not a non-empty array", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, paths]) => {
			expect(hasAnyPath({ a: 1 }, paths)).toBe(false);
		});
	});

	test("should return true if object has any of the given properties", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(hasAnyPath(object, ["a"])).toBe(true);
		expect(hasAnyPath(object, ["b", "d"])).toBe(true);
	});

	test("should return false if object does not have any of the given properties", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(hasAnyPath(object, ["d"])).toBe(false);
		expect(hasAnyPath(object, ["e", "f"])).toBe(false);
	});

	test("should return true if object has any of the deeply nested properties", () => {
		const object = { a: { b: { c: 1 } } };

		expect(hasAnyPath(object, ["a.b.c"])).toBe(true);
		expect(hasAnyPath(object, ["a.b.d", "a.b.c"])).toBe(true);
	});

	test("should return false if object does not have any of the deeply nested properties", () => {
		const object = { a: { b: { c: 1 } } };

		expect(hasAnyPath(object, ["a.b.d"])).toBe(false);
		expect(hasAnyPath(object, ["a.b.e", "a.b.f"])).toBe(false);
	});

	test("should return true when a path traverses a nested array via a numeric segment", () => {
		const object = { users: [{ name: "Sophie" }] };

		expect(hasAnyPath(object, ["users.0.name"])).toBe(true);
	});

	test("should return false when a numeric segment is out of bounds", () => {
		const object = { users: [{ name: "Sophie" }] };

		expect(hasAnyPath(object, ["users.5.name"])).toBe(false);
	});

	test("should return true when a path exists with a null value", () => {
		const object = { user: { name: null } };

		expect(hasAnyPath(object, ["user.name"])).toBe(true);
	});
});
