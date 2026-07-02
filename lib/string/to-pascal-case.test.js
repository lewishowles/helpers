import { describe, expect, test } from "vite-plus/test";
import { toPascalCase } from "./to-pascal-case";

describe("to-pascal-case", () => {
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
			expect(toPascalCase(input)).toBe("");
		});
	});

	test.for([
		["camelCase", "CamelCase"],
		["PascalCase", "PascalCase"],
		["kebab-case", "KebabCase"],
		["snake_case", "SnakeCase"],
		["SCREAMING_SNAKE", "ScreamingSnake"],
		["APIKey", "ApiKey"],
		["HTMLElement", "HtmlElement"],
		["item2Name", "Item2Name"],
		["2ndPlace", "2ndPlace"],
		["parseXMLString", "ParseXmlString"],
		["camelAPIKey", "CamelApiKey"],
		["foo-bar_bog baz", "FooBarBogBaz"],
		["hello", "Hello"],
		["HELLO", "Hello"],
		["", ""],
		["123", "123"],
		["fooBAR", "FooBar"],
		["fooBARBaz", "FooBarBaz"],
		["FOOBar", "FooBar"],
		["already lowercase", "AlreadyLowercase"],
	])("%s → %s", ([input, expected]) => {
		expect(toPascalCase(input)).toBe(expected);
	});
});
