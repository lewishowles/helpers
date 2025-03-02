import { describe, expect, test } from "vitest";
import { add } from "./add";

describe("add", () => {
	describe("should return an empty object if provided anything but a non-empty object", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(add(input, "key", "value")).toEqual({});
		});
	});

	describe("should return the original object if the provided key is anything but a non-empty string", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			const object = { existing_key: "existing_value" };

			expect(add(object, input, "value")).toEqual(object);
		});
	});

	test("should add the key/value pair if the key does not exist in the object", () => {
		expect(add({ existing_key: "existing_value" }, "new_key", "new_value")).toEqual({
			existing_key: "existing_value",
			new_key: "new_value",
		});
	});

	test("should add the key/value pair if the key exists but its value is undefined", () => {
		expect(add({ existing_key: "existing_value", second_key: undefined }, "second_key", "second_value")).toEqual({
			existing_key: "existing_value",
			second_key: "second_value",
		});
	});

	test("should add the key/value pair if the key exists but its value is undefined null", () => {
		expect(add({ existing_key: "existing_value", second_key: null }, "second_key", "second_value")).toEqual({
			existing_key: "existing_value",
			second_key: "second_value",
		});
	});

	describe("should not overwrite the existing value if the key exists and its value is not undefined or null", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
		])("%s", ([, value]) => {
			expect(add({ existing_key: value }, "existing_key", "new_value")).toEqual({
				existing_key: value,
			});
		});
	});
});
