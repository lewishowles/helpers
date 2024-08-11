import { describe, expect, test } from "vitest";
import { getFriendlyDisplay } from "./get-friendly-display";

describe("get-friendly-display", () => {
	test("should handle null", () => {
		expect(getFriendlyDisplay(null)).toBe("<null>");
	});

	test("should handle undefined", () => {
		expect(getFriendlyDisplay(undefined)).toBe("<undefined>");
	});

	test("should handle strings", () => {
		expect(getFriendlyDisplay("hello")).toBe("hello <string[5]>");
		expect(getFriendlyDisplay("")).toBe("<string[0]>");
	});

	test("should handle arrays", () => {
		expect(getFriendlyDisplay(["A", "B", "C"])).toBe("<array[3]>");
		expect(getFriendlyDisplay([])).toBe("<array[0]>");
	});

	test("should handle objects", () => {
		expect(getFriendlyDisplay({ property: "value", value: "property" })).toBe("<object[2]>");
		expect(getFriendlyDisplay({})).toBe("<object[0]>");
	});

	test("should handle NaN", () => {
		expect(getFriendlyDisplay(NaN)).toBe("<NaN>");
	});

	test("should handle infinity", () => {
		expect(getFriendlyDisplay(Infinity)).toBe("<infinity>");
	});

	test("should handle numbers", () => {
		expect(getFriendlyDisplay(123)).toBe("<number>");
		expect(getFriendlyDisplay(0)).toBe("<number>");
		expect(getFriendlyDisplay(-123)).toBe("<number>");
		expect(getFriendlyDisplay(1.23)).toBe("<number>");
	});
});
