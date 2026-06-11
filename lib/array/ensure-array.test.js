import { describe, expect, test } from "vite-plus/test";
import { ensureArray } from "./ensure-array";

describe("ensure-array", () => {
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
	])("Converts %s to array", ([, input]) => {
		expect(ensureArray(input)).toEqual([input]);
	});

	test("Does not modify an array", () => {
		expect(ensureArray([])).toEqual([]);
		expect(ensureArray(["one", "two"])).toEqual(["one", "two"]);
	});
});
