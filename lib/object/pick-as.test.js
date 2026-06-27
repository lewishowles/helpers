import { describe, expect, test } from "vite-plus/test";
import { pickAs } from "./pick-as";

describe("pickAs", () => {
	const sampleObject = {
		id: 1,
		name: "Sophie",
		location: {
			name: "London",
		},
	};

	describe("should return an empty object when the first argument is not a non-empty object", () => {
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
			expect(pickAs(input, { key: "path" })).toEqual({});
		});
	});

	describe("should return an empty object when the mapping is not a non-empty object", () => {
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
			expect(pickAs(sampleObject, input)).toEqual({});
		});
	});

	test("should pass through a direct-key mapping", () => {
		expect(pickAs(sampleObject, { id: "id", name: "name" })).toEqual({
			id: 1,
			name: "Sophie",
		});
	});

	test("should rename keys via mapping", () => {
		expect(pickAs(sampleObject, { identifier: "id", displayName: "name" })).toEqual({
			identifier: 1,
			displayName: "Sophie",
		});
	});

	test("should flatten nested paths via dot-notation", () => {
		expect(pickAs(sampleObject, { locationName: "location.name" })).toEqual({
			locationName: "London",
		});
	});

	test("should combine pass-through, rename, and flatten in one call", () => {
		expect(
			pickAs(sampleObject, {
				id: "id",
				displayName: "name",
				locationName: "location.name",
			}),
		).toEqual({
			id: 1,
			displayName: "Sophie",
			locationName: "London",
		});
	});

	test("should include keys for missing source paths as undefined", () => {
		expect(pickAs(sampleObject, { id: "id", missing: "does.not.exist" })).toEqual({
			id: 1,
			missing: undefined,
		});
	});

	test("should return an empty object when mapping is an empty object", () => {
		expect(pickAs(sampleObject, {})).toEqual({});
	});

	test("should not modify the original object", () => {
		const original = { a: 1, b: 2 };

		pickAs(original, { result: "a" });

		expect(original).toEqual({ a: 1, b: 2 });
	});
});
