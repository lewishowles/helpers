import { isDefined } from "./is-defined";
import { describe, expect, test } from "vite-plus/test";

describe("is-defined", () => {
	describe("should detect defined values", () => {
		test.for([
			["string (non-empty)", "hello"],
			["string (empty)", ""],
			["number (positive)", 1],
			["number (zero)", 0],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["boolean (true)", true],
			["boolean (false)", false],
			["array (empty)", []],
			["array (non-empty)", [1, 2]],
			["object (empty)", {}],
			["object (non-empty)", { property: "value" }],
		])("%s", ([, input]) => {
			expect(isDefined(input)).toBe(true);
		});
	});

	describe("should detect undefined values", () => {
		test.for([
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isDefined(input)).toBe(false);
		});
	});
});
