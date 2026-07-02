import { describe, expect, test } from "vite-plus/test";
import { firstDefinedPath } from "./first-defined-path";

describe("first-defined-path", () => {
	describe("should return undefined if the input is not a non-empty object", () => {
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
			expect(firstDefinedPath(input, ["a"])).toBe(undefined);
		});
	});

	describe("should return undefined if `paths` is not a non-empty array", () => {
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
			expect(firstDefinedPath({ a: 1 }, paths)).toBe(undefined);
		});
	});

	test("should return the value at the first path that exists", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(firstDefinedPath(object, ["a"])).toBe(1);
		expect(firstDefinedPath(object, ["c", "a"])).toBe(3);
		expect(firstDefinedPath(object, ["d", "b"])).toBe(2);
	});

	test("should return undefined if no path exists", () => {
		const object = { a: 1, b: 2, c: 3 };

		expect(firstDefinedPath(object, ["d"])).toBe(undefined);
		expect(firstDefinedPath(object, ["e", "f"])).toBe(undefined);
	});

	test("should return the value at the first deeply nested path that exists", () => {
		const object = { a: { b: { c: 1 } } };

		expect(firstDefinedPath(object, ["a.b.c"])).toBe(1);
		expect(firstDefinedPath(object, ["a.b.d", "a.b.c"])).toBe(1);
	});

	test("should return undefined if no deeply nested path exists", () => {
		const object = { a: { b: { c: 1 } } };

		expect(firstDefinedPath(object, ["a.b.d"])).toBe(undefined);
		expect(firstDefinedPath(object, ["a.b.e", "a.b.f"])).toBe(undefined);
	});

	test("should skip paths with null or undefined values and continue to the next", () => {
		const object = { a: null, b: undefined, c: 3 };

		expect(firstDefinedPath(object, ["a", "b", "c"])).toBe(3);
		expect(firstDefinedPath(object, ["a", "b"])).toBe(undefined);
	});

	test("should return undefined when a path exists but its value is null", () => {
		const object = { user: { name: null } };

		expect(firstDefinedPath(object, ["user.name"])).toBe(undefined);
	});

	test("should return the value when a path traverses a nested array via a numeric segment", () => {
		const object = { users: [{ name: "Sophie" }] };

		expect(firstDefinedPath(object, ["users.0.name"])).toBe("Sophie");
	});

	test("should skip an out-of-bounds numeric segment and continue to the next path", () => {
		const object = { users: [{ name: "Sophie" }] };

		expect(firstDefinedPath(object, ["users.5.name", "users.0.name"])).toBe("Sophie");
	});

	test("should return undefined when all numeric segments are out of bounds", () => {
		const object = { users: [{ name: "Sophie" }] };

		expect(firstDefinedPath(object, ["users.5.name", "users.10.name"])).toBe(undefined);
	});

	test("should treat falsy but defined values as valid results", () => {
		const object = { a: 0, b: "", c: false };

		expect(firstDefinedPath(object, ["a"])).toBe(0);
		expect(firstDefinedPath(object, ["d", "b"])).toBe("");
		expect(firstDefinedPath(object, ["d", "e", "c"])).toBe(false);
	});
});
