import { describe, expect, test } from "vitest";
import { isFunction } from "./is-function";

describe("is-function", () => {
	test("should detect functions", () => {
		const test = () => "hello";

		expect(isFunction(test)).toBe(true);
	});

	describe("should detect non-functions", () => {
		test.for([
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
			expect(isFunction(input)).toBe(false);
		});
	});
});
