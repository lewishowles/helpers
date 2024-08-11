import { describe, expect, test } from "vitest";
import { pick } from "./pick";

describe("pick", () => {
	const sampleObject = {
		name: "Sophie",
		profile: "linkedin/sophie",
		colour: "purple",
	};

	describe("should return an empty object for a non-object", () => {
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
			expect(pick(input, ["property"])).toEqual({});
		});
	});

	describe("should return an empty object for non-array properties", () => {
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
			expect(pick(sampleObject, input)).toEqual({});
		});
	});

	test("should pick properties from an object", () => {
		expect(pick(sampleObject, ["name", "profile"])).toEqual({ name: "Sophie", profile: "linkedin/sophie" });
	});

	test("should discard unknown properties", () => {
		expect(pick(sampleObject, ["name", "profile", "homepage"])).toEqual({ name: "Sophie", profile: "linkedin/sophie" });
	});
});
