import { describe, expect, test } from "vitest";
import { omit } from "./omit";

describe("omit", () => {
	const sampleObject = {
		name: "Sophie",
		profile: "linkedin/sophie",
		colour: "purple",
	};

	describe("should return the same object for a non-object", () => {
		test.each([
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
			expect(omit(input, ["property"])).toEqual(input);
		});
	});

	describe("should return the same object for non-array properties", () => {
		test.each([
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
			expect(omit(sampleObject, input)).toEqual(sampleObject);
		});
	});

	test("should omit properties from an object", () => {
		expect(omit(sampleObject, ["name", "profile"])).toEqual({ colour: "purple" });
	});

	test("should discard unknown properties", () => {
		expect(omit(sampleObject, ["name", "profile", "homepage"])).toEqual({ colour: "purple" });
	});
});
