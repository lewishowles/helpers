import { describe, expect, test } from "vitest";
import { pluck } from "./pluck";

describe("pluck", () => {
	const sampleArray = [
		{ name: "Sophie", profile: "linkedin/sophie" },
		{ name: "Hannah", profile: "linkedin/hannah" },
		{ name: "WALL-E", profile: "linkedin/wall-e" },
		{ name: "Eva", profile: "linkedin/eva" },
	];

	describe("should return an empty array for any non-arrays", () => {
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
			expect(pluck(input, "property")).toEqual([]);
		});
	});

	describe("should return an empty array for a non-string property", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, property]) => {
			expect(pluck(sampleArray, property)).toEqual([]);
		});
	});

	test("should return an array of values", () => {
		expect(pluck(sampleArray, "name")).toEqual(["Sophie", "Hannah", "WALL-E", "Eva"]);
	});

	describe("should discard non-objects", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(pluck([...sampleArray, input], "name")).toEqual(["Sophie", "Hannah", "WALL-E", "Eva"]);
		});
	});

	test("should return undefined for an object without the given property", () => {
		expect(pluck([...sampleArray, { profile: "linkedin/mickey" }], "name")).toEqual(["Sophie", "Hannah", "WALL-E", "Eva", undefined]);
	});
});
