import { toScreamingSnakeCase } from "./to-screaming-snake-case";
import { describe, expect, test } from "vite-plus/test";

describe("to-screaming-snake-case", () => {
	describe("should return an empty string for non-string inputs", () => {
		test.for([
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
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(toScreamingSnakeCase(input)).toBe("");
		});
	});

	test.for([
		["camelCase", "CAMEL_CASE"],
		["PascalCase", "PASCAL_CASE"],
		["kebab-case", "KEBAB_CASE"],
		["snake_case", "SNAKE_CASE"],
		["SCREAMING_SNAKE", "SCREAMING_SNAKE"],
		["APIKey", "API_KEY"],
		["HTMLElement", "HTML_ELEMENT"],
		["item2Name", "ITEM2_NAME"],
		["2ndPlace", "2ND_PLACE"],
		["parseXMLString", "PARSE_XML_STRING"],
		["camelAPIKey", "CAMEL_API_KEY"],
		["foo-bar_bog baz", "FOO_BAR_BOG_BAZ"],
		["hello", "HELLO"],
		["HELLO", "HELLO"],
		["", ""],
		["123", "123"],
		["fooBAR", "FOO_BAR"],
		["fooBARBaz", "FOO_BAR_BAZ"],
		["FOOBar", "FOO_BAR"],
		["already lowercase", "ALREADY_LOWERCASE"],
	])("%s → %s", ([input, expected]) => {
		expect(toScreamingSnakeCase(input)).toBe(expected);
	});
});
