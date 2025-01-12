import { describe, expect, test } from "vitest";
import { round } from "./round";

describe("round", () => {
	test("should round a number to the specified number of decimal places", () => {
		expect(round(1.2345, 2)).toBe(1.23);
		expect(round(1.2355, 2)).toBe(1.24);
		expect(round(1.2345, 0)).toBe(1);
		expect(round(1.5, 0)).toBe(2);
	});

	test("should throw a TypeError if arguments are not numbers", () => {
		expect(() => round("1.2345", 2)).toThrow(TypeError);
		expect(() => round(1.2345, "2")).toThrow(TypeError);
		expect(() => round("1.2345", "2")).toThrow(TypeError);
	});

	test("should throw a RangeError if arguments are not finite numbers", () => {
		expect(() => round(Infinity, 2)).toThrow(RangeError);
		expect(() => round(1.2345, Infinity)).toThrow(RangeError);
		expect(() => round(Infinity, Infinity)).toThrow(RangeError);
	});

	test("should handle negative decimal places", () => {
		expect(round(12345, -1)).toBe(12350);
		expect(round(12345, -2)).toBe(12300);
		expect(round(12345, -3)).toBe(12000);
	});
});
