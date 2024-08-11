import { describe, expect, test } from "vitest";
import { get } from "./get";


describe("get", () => {
	const sampleObject = {
		name: "Sophie",
		profiles: {
			linkedIn: "linkedin/sophie",
			behance: {
				icon: "behance.icon",
				url: "behance/sophie",
			},
		},
	};

	test("should retrieve a top level property", () => {
		expect(get(sampleObject, "name")).toBe("Sophie");
	});

	test("should retrieve a nested property", () => {
		expect(get(sampleObject, "profiles.behance.url")).toBe("behance/sophie");
	});

	test("should return null if a property doesn't exist", () => {
		expect(get(sampleObject, "profiles.behance.mistake")).toBe(null);
	});

	describe("should return null for a non-object", () => {
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
			expect(get(input, "name")).toBe(null);
		});
	});
});
