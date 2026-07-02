import { describe, expect, test } from "vite-plus/test";
import { toCamelCase } from "./to-camel-case";

describe("to-camel-case", () => {
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
			expect(toCamelCase(input)).toBe("");
		});
	});

	test.for([
		["camelCase", "camelCase"],
		["PascalCase", "pascalCase"],
		["kebab-case", "kebabCase"],
		["snake_case", "snakeCase"],
		["SCREAMING_SNAKE", "screamingSnake"],
		["APIKey", "apiKey"],
		["HTMLElement", "htmlElement"],
		["item2Name", "item2Name"],
		["2ndPlace", "2ndPlace"],
		["parseXMLString", "parseXmlString"],
		["camelAPIKey", "camelApiKey"],
		["foo-bar_bog baz", "fooBarBogBaz"],
		["hello", "hello"],
		["HELLO", "hello"],
		["", ""],
		["123", "123"],
		["fooBAR", "fooBar"],
		["fooBARBaz", "fooBarBaz"],
		["FOOBar", "fooBar"],
		["already lowercase", "alreadyLowercase"],
	])("%s → %s", ([input, expected]) => {
		expect(toCamelCase(input)).toBe(expected);
	});
});
