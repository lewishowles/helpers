import { getSlotText } from "./get-slot-text";
import { describe, expect, test } from "vite-plus/test";
import { Comment, Fragment, Text } from "vue";

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
		/**
		 * Stand in for a component's default slot containing one Text node.
		 *
		 * @returns  {object[]}
		 *     A Text vnode with content.
		 */
		const slot = () => [{ type: Text, children: "Text content" }];

		expect(getSlotText(slot)).toBe("Text content");
	});

	test("should return trimmed text content when trim option is true", () => {
		/**
		 * Stand in for a default slot with whitespace around its text.
		 *
		 * @returns  {object[]}
		 *     A Text vnode with surrounding whitespace.
		 */
		const slot = () => [{ type: Text, children: "   Text content   " }];

		expect(getSlotText(slot, { trim: true })).toBe("Text content");
	});

	test("should return untrimmed text content when trim option is false", () => {
		/**
		 * Stand in for a default slot whose text keeps its whitespace.
		 *
		 * @returns  {object[]}
		 *     A Text vnode with surrounding whitespace.
		 */
		const slot = () => [{ type: Text, children: "   Text content   " }];

		expect(getSlotText(slot, { trim: false })).toBe("   Text content   ");
	});

	test("should return concatenated text content for multiple Text nodes", () => {
		/**
		 * Stand in for a default slot containing two adjacent Text nodes.
		 *
		 * @returns  {object[]}
		 *     Two Text vnodes in order.
		 */
		const slot = () => [
			{ type: Text, children: "First" },
			{ type: Text, children: "Second" },
		];

		expect(getSlotText(slot)).toBe("FirstSecond");
	});

	test("should return concatenated text content for nested children", () => {
		/**
		 * Stand in for a default slot with Text nodes inside a Fragment.
		 *
		 * @returns  {object[]}
		 *     A Fragment containing two Text vnodes.
		 */
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
		/**
		 * Stand in for a default slot with a Comment before visible text.
		 *
		 * @returns  {object[]}
		 *     A Comment vnode followed by a Text vnode.
		 */
		const slot = () => [
			{ type: Comment, children: "Comment" },
			{ type: Text, children: "Text content" },
		];

		expect(getSlotText(slot)).toBe("Text content");
	});

	test("should return an empty string for nodes with no valid children", () => {
		/**
		 * Stand in for a default slot containing an empty Fragment.
		 *
		 * @returns  {object[]}
		 *     A Fragment vnode with no children.
		 */
		const slot = () => [{ type: Fragment, children: [] }];

		expect(getSlotText(slot)).toBe("");
	});
});
