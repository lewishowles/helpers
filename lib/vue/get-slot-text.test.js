import { Comment, Fragment, Text } from "vue";
import { describe, expect, test } from "vitest";
import { getSlotText } from "./get-slot-text";

describe("getSlotText", () => {
	describe("should return false for anything but function slot", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (empty)", []],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(getSlotText(input)).toBe("");
		});
	});

	test("should return text content for a non-empty Text node", () => {
		const slot = () => [{ type: Text, children: "Text content" }];

		expect(getSlotText(slot)).toBe("Text content");
	});

	test("should return trimmed text content when trim option is true", () => {
		const slot = () => [{ type: Text, children: "   Text content   " }];

		expect(getSlotText(slot, { trim: true })).toBe("Text content");
	});

	test("should return untrimmed text content when trim option is false", () => {
		const slot = () => [{ type: Text, children: "   Text content   " }];

		expect(getSlotText(slot, { trim: false })).toBe("   Text content   ");
	});

	test("should return concatenated text content for multiple Text nodes", () => {
		const slot = () => [
			{ type: Text, children: "First" },
			{ type: Text, children: "Second" },
		];

		expect(getSlotText(slot)).toBe("FirstSecond");
	});

	test("should return concatenated text content for nested children", () => {
		const slot = () => [
			{
				type: Fragment,
				children: [
					{ type: Text, children: "Nested" },
					{ type: Text, children: "Content" },
				],
			},
		];

		expect(getSlotText(slot)).toBe("NestedContent");
	});

	test("should ignore Comment nodes", () => {
		const slot = () => [
			{ type: Comment, children: "Comment" },
			{ type: Text, children: "Text content" },
		];

		expect(getSlotText(slot)).toBe("Text content");
	});

	test("should return an empty string for nodes with no valid children", () => {
		const slot = () => [{ type: Fragment, children: [] }];

		expect(getSlotText(slot)).toBe("");
	});
});
