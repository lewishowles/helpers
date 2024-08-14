import { Comment, Fragment, Text } from "vue";
import { describe, expect, test } from "vitest";
import { isNonEmptySlot } from "./is-non-empty-slot";

describe("is-non-empty-slot", () => {
	describe("should return false for anything but a function slot", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(isNonEmptySlot(input)).toBe(false);
		});
	});

	test("should return false for a Comment node", () => {
		const slot = () => [{ type: Comment }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return false for an empty Text node", () => {
		const slot = () => [{ type: Text, children: "" }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return false for an empty Fragment", () => {
		const slot = () => [{ type: Fragment, children: [] }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return true for a non-empty Text node", () => {
		const slot = () => [{ type: Text, children: "Text content" }];

		expect(isNonEmptySlot(slot)).toBe(true);
	});

	test("should return true for a non-empty Fragment", () => {
		const slot = () => [{ type: Fragment, children: [{ type: Text, children: "Text content" }] }];

		expect(isNonEmptySlot(slot)).toBe(true);
	});
});
