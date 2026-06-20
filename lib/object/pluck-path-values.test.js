import { describe, expect, test } from "vite-plus/test";
import { pluckPathValues } from "./pluck-path-values";

describe("pluck-path-values", () => {
	const sampleArray = [
		{ user: { name: "Sophie", profile: "linkedin/sophie" } },
		{ user: { name: "Hannah", profile: "linkedin/hannah" } },
		{ user: { name: "WALL-E", profile: "linkedin/wall-e" } },
		{ user: { name: "Eva", profile: "linkedin/eva" } },
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
			expect(pluckPathValues(input, "user.name")).toEqual([]);
		});
	});

	describe("should return an empty array for a non-string path", () => {
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
		])("%s", ([, path]) => {
			expect(pluckPathValues(sampleArray, path)).toEqual([]);
		});
	});

	test("should return an array of path values", () => {
		expect(pluckPathValues(sampleArray, "user.name")).toEqual([
			"Sophie",
			"Hannah",
			"WALL-E",
			"Eva",
		]);
	});

	test("should retrieve values through a nested array using a numeric segment", () => {
		const array = [
			{ users: [{ name: "Sophie" }, { name: "Maisie" }] },
			{ users: [{ name: "Hannah" }, { name: "Mabel" }] },
		];

		expect(pluckPathValues(array, "users.1.name")).toEqual(["Maisie", "Mabel"]);
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
			expect(pluckPathValues([...sampleArray, input], "user.name")).toEqual([
				"Sophie",
				"Hannah",
				"WALL-E",
				"Eva",
			]);
		});
	});

	test("should return undefined for an object without the given path", () => {
		expect(
			pluckPathValues([...sampleArray, { user: { profile: "linkedin/mickey" } }], "user.name"),
		).toEqual(["Sophie", "Hannah", "WALL-E", "Eva", undefined]);
	});
});
