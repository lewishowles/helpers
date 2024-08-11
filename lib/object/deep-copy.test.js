import { describe, expect, test } from "vitest";
import { deepCopy } from "./deep-copy";

describe("deep-copy", () => {
	describe("should return the original value for a non-object non-array input", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(deepCopy(input)).toBe(input);
		});
	});

	test("should return a copy of the original object", () => {
		const original = {
			name: "Sophie",
			profiles: {
				linkedIn: "linkedin/sophie",
			},
		};

		const copied = deepCopy(original);

		expect(copied).not.toBe(original);
		expect(copied).toEqual(original);
		expect(copied.profiles).not.toBe(original.profiles);
		expect(copied.profiles).toEqual(original.profiles);
	});
});
