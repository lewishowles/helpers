import { tokeniseWords } from "./tokenise-words";
import { describe, expect, test } from "vite-plus/test";

describe("tokenise-words", () => {
	test.for([
		["camelCase", ["camel", "Case"]],
		["PascalCase", ["Pascal", "Case"]],
		["kebab-case", ["kebab", "case"]],
		["snake_case", ["snake", "case"]],
		["SCREAMING_SNAKE", ["SCREAMING", "SNAKE"]],
		["APIKey", ["API", "Key"]],
		["HTMLElement", ["HTML", "Element"]],
		["item2Name", ["item2", "Name"]],
		["2ndPlace", ["2nd", "Place"]],
		["parseXMLString", ["parse", "XML", "String"]],
		["camelAPIKey", ["camel", "API", "Key"]],
		["foo-bar_bog baz", ["foo", "bar", "bog", "baz"]],
		["hello", ["hello"]],
		["HELLO", ["HELLO"]],
		["123", ["123"]],
		["fooBAR", ["foo", "BAR"]],
		["fooBARBaz", ["foo", "BAR", "Baz"]],
		["FOOBar", ["FOO", "Bar"]],
		["FOOBarBaz", ["FOO", "Bar", "Baz"]],
		["already lowercase", ["already", "lowercase"]],
		["__leading", ["leading"]],
		["trailing__", ["trailing"]],
		["foo--bar", ["foo", "bar"]],
		["MiXeD", ["Mi", "Xe", "D"]],
		["v2.0.1", ["v2.0.1"]],
		["XML", ["XML"]],
		["XML2Json", ["XML2", "Json"]],
		["JSON5Data", ["JSON5", "Data"]],
	])("%s → %s", ([input, expected]) => {
		expect(tokeniseWords(input)).toEqual(expected);
	});

	test("should return an empty array for an empty string", () => {
		expect(tokeniseWords("")).toEqual([]);
	});
});
