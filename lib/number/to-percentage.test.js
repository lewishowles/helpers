import { toPercentage } from "./to-percentage";
import { describe, expect, test } from "vite-plus/test";

describe("to-percentage", () => {
	describe("should calculate percentage", () => {
		test.for([
			["half", 50, 100, 50],
			["quarter", 1, 4, 25],
			["full", 100, 100, 100],
			["zero value", 0, 100, 0],
			["over 100", 150, 100, 150],
			["float value", 3, 10, 30],
		])("%s", ([, value, total, expected]) => {
			expect(toPercentage(value, total)).toBe(expected);
		});
	});

	describe("should return 0 for zero or falsy total", () => {
		test.for([
			["zero total", 10, 0],
			["null total", 10, null],
			["undefined total", 10, undefined],
			["NaN total", 10, NaN],
			["empty string total", 10, ""],
			["false total", 10, false],
		])("%s", ([, value, total]) => {
			expect(toPercentage(value, total)).toBe(0);
		});
	});

	describe("should return 0 for non-finite value", () => {
		test.for([
			["NaN value", NaN, 100],
			["Infinity value", Infinity, 100],
		])("%s", ([, value, total]) => {
			expect(toPercentage(value, total)).toBe(0);
		});
	});

	test("should coerce string inputs", () => {
		expect(toPercentage("25", "100")).toBe(25);
	});
});
