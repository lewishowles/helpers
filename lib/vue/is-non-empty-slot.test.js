import { isNonEmptySlot } from "./is-non-empty-slot";
import { describe, expect, test } from "vite-plus/test";
import { Comment, Fragment, Text } from "vue";

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
		/**
		 * Stand in for a default slot containing only a Comment node.
		 *
		 * @returns  {object[]}
		 *     A Comment vnode with no visible content.
		 */
		const slot = () => [{ type: Comment }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return false for an empty Text node", () => {
		/**
		 * Stand in for a default slot containing empty text.
		 *
		 * @returns  {object[]}
		 *     A Text vnode with an empty string.
		 */
		const slot = () => [{ type: Text, children: "" }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return false for an empty Fragment", () => {
		/**
		 * Stand in for a default slot containing an empty Fragment.
		 *
		 * @returns  {object[]}
		 *     A Fragment vnode with no children.
		 */
		const slot = () => [{ type: Fragment, children: [] }];

		expect(isNonEmptySlot(slot)).toBe(false);
	});

	test("should return true for a non-empty Text node", () => {
		/**
		 * Stand in for a default slot containing visible text.
		 *
		 * @returns  {object[]}
		 *     A Text vnode with content.
		 */
		const slot = () => [{ type: Text, children: "Text content" }];

		expect(isNonEmptySlot(slot)).toBe(true);
	});

	test("should return true for a non-empty Fragment", () => {
		/**
		 * Stand in for a default slot with visible text inside a Fragment.
		 *
		 * @returns  {object[]}
		 *     A Fragment containing a Text vnode.
		 */
		const slot = () => [{ type: Fragment, children: [{ type: Text, children: "Text content" }] }];

		expect(isNonEmptySlot(slot)).toBe(true);
	});
});
