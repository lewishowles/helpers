import { toKebabCase } from "./to-kebab-case";
import { describe, expect, test } from "vite-plus/test";

describe("to-kebab-case", () => {
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
			expect(toKebabCase(input)).toBe("");
		});
	});

	test.for([
		["camelCase", "camel-case"],
		["PascalCase", "pascal-case"],
		["kebab-case", "kebab-case"],
		["snake_case", "snake-case"],
		["SCREAMING_SNAKE", "screaming-snake"],
		["APIKey", "api-key"],
		["HTMLElement", "html-element"],
		["item2Name", "item2-name"],
		["2ndPlace", "2nd-place"],
		["parseXMLString", "parse-xml-string"],
		["camelAPIKey", "camel-api-key"],
		["foo-bar_bog baz", "foo-bar-bog-baz"],
		["hello", "hello"],
		["HELLO", "hello"],
		["", ""],
		["123", "123"],
		["fooBAR", "foo-bar"],
		["fooBARBaz", "foo-bar-baz"],
		["FOOBar", "foo-bar"],
		["already lowercase", "already-lowercase"],
	])("%s → %s", ([input, expected]) => {
		expect(toKebabCase(input)).toBe(expected);
	});
});
