import { describe, expect, it } from "vitest";
import { getFriendlyDisplay } from "./get-friendly-display";

describe("get-friendly-display", () => {
	it("should handle null", () => {
		expect(getFriendlyDisplay(null)).toBe("<null>");
	});

	it("should handle undefined", () => {
		expect(getFriendlyDisplay(undefined)).toBe("<undefined>");
	});

	it("should handle strings", () => {
		expect(getFriendlyDisplay("hello")).toBe("hello <string[5]>");
		expect(getFriendlyDisplay("")).toBe("<string[0]>");
	});

	it("should handle arrays", () => {
		expect(getFriendlyDisplay(["A", "B", "C"])).toBe("<array[3]>");
		expect(getFriendlyDisplay([])).toBe("<array[0]>");
	});

	it("should handle objects", () => {
		expect(getFriendlyDisplay({ property: "value", value: "property" })).toBe("<object[2]>");
		expect(getFriendlyDisplay({})).toBe("<object[0]>");
	});

	it("should handle NaN", () => {
		expect(getFriendlyDisplay(NaN)).toBe("<NaN>");
	});

	it("should handle infinity", () => {
		expect(getFriendlyDisplay(Infinity)).toBe("<infinity>");
	});

	it("should handle numbers", () => {
		expect(getFriendlyDisplay(123)).toBe("<number>");
		expect(getFriendlyDisplay(0)).toBe("<number>");
		expect(getFriendlyDisplay(-123)).toBe("<number>");
		expect(getFriendlyDisplay(1.23)).toBe("<number>");
	});
});
