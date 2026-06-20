import { describe, expect, test } from "vite-plus/test";
import { getPathValue } from "./get-path-value";

describe("getPathValue", () => {
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
		expect(getPathValue(sampleObject, "name")).toBe("Sophie");
	});

	test("should retrieve a nested property", () => {
		expect(getPathValue(sampleObject, "profiles.behance.url")).toBe("behance/sophie");
	});

	test("should return undefined if a property doesn't exist", () => {
		expect(getPathValue(sampleObject, "profiles.behance.mistake")).toBeUndefined();
	});

	describe("should return undefined for a non-object", () => {
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
			expect(getPathValue(input, "name")).toBeUndefined();
		});
	});

	test("should allow the return value to be updated", () => {
		expect(getPathValue(sampleObject, "profiles.behance.mistake", false)).toBe(false);
	});

	test("should retrieve a value through a nested array using a numeric segment", () => {
		const object = { users: [{ name: "Sophie" }, { name: "Maisie" }] };

		expect(getPathValue(object, "users.0.name")).toBe("Sophie");
		expect(getPathValue(object, "users.1.name")).toBe("Maisie");
	});

	test("should return undefined when a numeric segment is out of bounds", () => {
		expect(getPathValue({ items: ["a", "b"] }, "items.5")).toBeUndefined();
	});

	test("should return undefined when a non-integer segment is applied to an array", () => {
		expect(getPathValue({ items: ["a", "b"] }, "items.name")).toBeUndefined();
	});
});
