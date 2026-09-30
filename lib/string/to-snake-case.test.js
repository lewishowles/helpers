import { toSnakeCase } from "./to-snake-case";
import { describe, expect, test } from "vite-plus/test";

describe("to-snake-case", () => {
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
			expect(toSnakeCase(input)).toBe("");
		});
	});

	test.for([
		["camelCase", "camel_case"],
		["PascalCase", "pascal_case"],
		["kebab-case", "kebab_case"],
		["snake_case", "snake_case"],
		["SCREAMING_SNAKE", "screaming_snake"],
		["APIKey", "api_key"],
		["HTMLElement", "html_element"],
		["item2Name", "item2_name"],
		["2ndPlace", "2nd_place"],
		["parseXMLString", "parse_xml_string"],
		["camelAPIKey", "camel_api_key"],
		["foo-bar_bog baz", "foo_bar_bog_baz"],
		["hello", "hello"],
		["HELLO", "hello"],
		["", ""],
		["123", "123"],
		["fooBAR", "foo_bar"],
		["fooBARBaz", "foo_bar_baz"],
		["FOOBar", "foo_bar"],
		["already lowercase", "already_lowercase"],
	])("%s → %s", ([input, expected]) => {
		expect(toSnakeCase(input)).toBe(expected);
	});
});
