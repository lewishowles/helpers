import { toNullableString } from "./to-nullable-string";
import { describe, expect, test } from "vite-plus/test";

describe("to-nullable-string", () => {
	describe("should return empty string for absent values", () => {
		test.for([
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(toNullableString(input)).toBe("");
		});
	});

	describe("should coerce to string", () => {
		test.for([
			["string (non-empty)", "hello", "hello"],
			["string (empty)", "", ""],
			["number (positive)", 42, "42"],
			["number (zero)", 0, "0"],
			["number (negative)", -7, "-7"],
			["number (float)", 3.14, "3.14"],
			["boolean (true)", true, "true"],
			["boolean (false)", false, "false"],
			["array", [1, 2], "1,2"],
			["object", { key: "value" }, "[object Object]"],
		])("%s", ([, input, expected]) => {
			expect(toNullableString(input)).toBe(expected);
		});
	});
});
