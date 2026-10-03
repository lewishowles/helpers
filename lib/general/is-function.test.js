import { isFunction } from "./is-function";
import { describe, expect, test } from "vite-plus/test";

describe("is-function", () => {
	test("should detect functions", () => {
		/**
		 * Return a value for the function check.
		 *
		 * @returns  {string}
		 *     The test value.
		 */
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
