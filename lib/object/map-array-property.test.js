import { mapArrayProperty } from "./map-array-property";
import { describe, expect, test } from "vite-plus/test";

describe("mapArrayProperty", () => {
	test("maps the array at the given property", () => {
		expect(mapArrayProperty({ items: [1, 2, 3] }, "items", (item) => item * 2)).toEqual({
			items: [2, 4, 6],
		});
	});

	test("keeps other properties untouched", () => {
		expect(mapArrayProperty({ total: 3, items: [1, 2, 3] }, "items", (item) => item * 2)).toEqual({
			total: 3,
			items: [2, 4, 6],
		});
	});

	describe("resolves the property to an empty array", () => {
		test.for([
			["missing property", { total: 0 }],
			["empty array", { items: [] }],
			["non-array property (string)", { items: "not-an-array" }],
			["non-array property (object)", { items: { a: 1 } }],
			["non-array property (null)", { items: null }],
		])("%s", ([, object]) => {
			expect(mapArrayProperty(object, "items", (item) => item)).toEqual({
				...object,
				items: [],
			});
		});
	});

	describe("returns a shallow copy of the object if the property is anything but a non-empty string", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number", 1],
			["string (empty)", ""],
			["array", [1, 2, 3]],
			["null", null],
			["undefined", undefined],
		])("%s", ([, property]) => {
			const object = { items: [1, 2, 3] };

			expect(mapArrayProperty(object, property, (item) => item)).toEqual(object);
		});
	});

	describe("returns an empty object for non-object input", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number", 1],
			["string", "string"],
			["array", [1, 2, 3]],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(mapArrayProperty(input, "items", (item) => item)).toEqual({});
		});
	});

	test("does not mutate the original object or array", () => {
		const original = { items: [1, 2, 3] };

		mapArrayProperty(original, "items", (item) => item * 2);

		expect(original).toEqual({ items: [1, 2, 3] });
	});

	test("does not call the mapper when the array is empty", () => {
		const mapper = (item) => item;

		let callCount = 0;

		mapArrayProperty({ items: [] }, "items", () => {
			callCount += 1;

			return mapper();
		});

		expect(callCount).toBe(0);
	});
});
