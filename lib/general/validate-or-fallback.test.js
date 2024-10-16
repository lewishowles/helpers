import { describe, expect, test } from "vitest";
import { validateOrFallback } from "./validate-or-fallback";

describe("is-function", () => {
	describe("string", () => {
		test("should allow the \"string\" keyword and return true for a string", () => {
			expect(validateOrFallback("hello", "string", "fallback")).toBe("hello");
		});

		test("should allow the \"string\" keyword and return true for an empty string", () => {
			expect(validateOrFallback("", "string", "fallback")).toBe("");
		});

		describe("should return the fallback for a non-string", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(validateOrFallback(input, "string", "fallback")).toBe("fallback");
			});
		});
	});

	describe("boolean", () => {
		test("should allow the \"boolean\" keyword and return a provided boolean", () => {
			expect(validateOrFallback(true, "boolean", false)).toBe(true);
			expect(validateOrFallback(false, "boolean", true)).toBe(false);
		});

		describe("should return the fallback for a non-boolean", () => {
			test.for([
				["number (positive)", 1],
				["number (negative)", -1],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(validateOrFallback(input, "boolean", false)).toBe(false);
			});
		});
	});

	describe("number", () => {
		test("should allow the \"number\" keyword and return a provided number", () => {
			expect(validateOrFallback(1, "number", 100)).toBe(1);
			expect(validateOrFallback(15, "number", 100)).toBe(15);
			expect(validateOrFallback(5e3, "number", 100)).toBe(5e3);
		});

		describe("should return the fallback for a non-number", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(validateOrFallback(input, "number", 100)).toBe(100);
			});
		});
	});

	describe("function", () => {
		test("should allow the \"function\" keyword and return a provided function", () => {
			expect(validateOrFallback(() => true, "function", "fallback")).toBeTypeOf("function");
		});

		describe("should return the fallback for a non-function", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(validateOrFallback(input, "function", "fallback")).toBe("fallback");
			});
		});
	});

	describe("array", () => {
		test("should allow the \"array\" keyword and return a provided array", () => {
			expect(validateOrFallback([1, 2, 3], "array", "fallback")).toEqual([1, 2, 3]);
			expect(validateOrFallback([], "array", "fallback")).toEqual([]);
		});

		describe("should return the fallback for a non-array", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(validateOrFallback(input, "array", "fallback")).toBe("fallback");
			});
		});
	});

	describe("object", () => {
		test("should allow the \"object\" keyword and return a provided object", () => {
			expect(validateOrFallback({ key: "value" }, "object", "fallback")).toEqual({ key: "value" });
			expect(validateOrFallback({}, "object", "fallback")).toEqual({});
		});

		describe("should return the fallback for a non-array", () => {
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
				expect(validateOrFallback(input, "object", "fallback")).toBe("fallback");
			});
		});
	});

	describe("provided function", () => {
		test("should allow a provided function to be used as the comparison", () => {
			expect(validateOrFallback("test value", () => true, "fallback")).toBe("test value");
		});

		describe("should return the fallback for a non-true return from the provided function", () => {
			test.for([
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, returnValue]) => {
				expect(validateOrFallback("test value", () => returnValue, "fallback")).toBe("fallback");
			});
		});
	});
});
