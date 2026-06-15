import { describe, expect, test } from "vite-plus/test";
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

	test("should allow the return value to be updated", () => {
		expect(get(sampleObject, "profiles.behance.mistake", false)).toBe(false);
	});

	test("should retrieve a value through a nested array using a numeric segment", () => {
		const object = { users: [{ name: "Sophie" }, { name: "Maisie" }] };

		expect(get(object, "users.0.name")).toBe("Sophie");
		expect(get(object, "users.1.name")).toBe("Maisie");
	});

	test("should return null when a numeric segment is out of bounds", () => {
		expect(get({ items: ["a", "b"] }, "items.5")).toBe(null);
	});

	test("should return null when a non-integer segment is applied to an array", () => {
		expect(get({ items: ["a", "b"] }, "items.name")).toBe(null);
	});
});
