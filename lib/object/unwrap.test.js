import { describe, expect, test } from "vitest";
import { unwrap } from "./unwrap";

describe("unwrap", () => {
	describe("should return null for empty object or non-object input", () => {
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
			expect(unwrap(input)).toBeNull();
		});
	});

	test("should retrieve a value for an object with a single key", () => {
		expect(unwrap({ key: "value" })).toBe("value");
	});

	test("should return undefined for a single key with an undefined value", () => {
		expect(unwrap({ key: undefined })).toBeUndefined();
	});

	test("should return null for a multi-key object", () => {
		expect(unwrap({ keyOne: "value one", keyTwo: "value two" })).toBeNull();
	});
});
