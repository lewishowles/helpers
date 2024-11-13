import { describe, expect, test } from "vitest";
import { size } from "./size";

describe("size", () => {
	test("should return the number of characters in a string", () => {
		expect(size("The quick brown fox")).toBe(19);
	});

	test("should return the numeric value of a number", () => {
		expect(size(9876)).toBe(9876);
	});

	test("should return the number of items in an array", () => {
		expect(size([1, 2, 3, 4])).toBe(4);
		expect(size([])).toBe(0);
	});

	test("should return the number of properties in an object", () => {
		expect(size({
			a: "b", c: "d", e: ["f", "g", "h"], i: 5,
		})).toBe(4);
		expect(size({})).toBe(0);
	});
});
