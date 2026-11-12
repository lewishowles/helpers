import { toSentenceCase } from "./to-sentence-case";
import { describe, expect, test } from "vite-plus/test";

describe("to-sentence-case", () => {
	describe("should return an empty string for non-string inputs", () => {
		test.for([
			["number", 42],
			["boolean (false)", false],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(toSentenceCase(input)).toBe("");
		});
	});

	describe("should return an empty string for strings with no words", () => {
		test.for([
			["empty string", ""],
			["only spaces", "   "],
		])("%s", ([, input]) => {
			expect(toSentenceCase(input)).toBe("");
		});
	});

	test.for([
		["helloWorld", "Hello world"],
		["user_id", "User id"],
		["HTMLParser", "Html parser"],
		["  spaced  out  ", "Spaced out"],
		["version2Release", "Version2 release"],
		["don't stop", "Don't stop"],
		["NASA launch", "Nasa launch"],
		["already-sentence_case", "Already sentence case"],
		["HELLO", "Hello"],
	])("%s → %s", ([input, expected]) => {
		expect(toSentenceCase(input)).toBe(expected);
	});
});
