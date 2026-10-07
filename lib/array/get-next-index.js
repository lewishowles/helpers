import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Find an adjacent index within an array.
 *
 * @helper getNextIndex
 * @category Array
 * @signature getNextIndex(index: number, reference: any[], { reverse: boolean = false, wrap: boolean = false })
 * @description
 * Given a starting `index`, determine the next available index in the
 * `reference` array.
 *
 * @param  {number}  index
 *     The whole-number index to move from.
 * @param  {any[]}  reference
 *     The array that defines the valid index range.
 * @param  {object}  options
 *     How to move at the ends of the array.
 * @param  {boolean}  [options.reverse=false]
 *     Whether to find the previous index instead of the next index.
 * @param  {boolean}  [options.wrap=false]
 *     Whether to wrap around when moving beyond either end of the array.
 * @returns  {number}
 *     The adjacent index, clamped or wrapped as requested.
 *
 * @note
 * An index outside the reference array is clamped unless wrapping is requested.
 * A non-whole index, or a reference that is not a non-empty array, returns `0`.
 *
 * @example
 * getNextIndex(3, ["A", "B", "C", "D"]); // 3
 * getNextIndex(3, ["A", "B", "C", "D"], { wrap: true }); // 0
 * getNextIndex(3, ["A", "B", "C", "D"], { reverse: true }); // 2
 * getNextIndex(-2, ["A", "B", "C"], { reverse: true, wrap: true }); // 0
 */
export function getNextIndex(index, reference, { reverse = false, wrap = false } = {}) {
	if (!Number.isInteger(index) || !isNonEmptyArray(reference)) {
		return 0;
	}

	// The number of items, used to clamp or wrap the index.
	const length = reference.length;

	if (reverse) {
		index--;
	} else {
		index++;
	}

	if (wrap) {
		// JavaScript's remainder keeps the sign of the index, so adding the
		// length and taking the remainder again maps negative indices into the
		// array too.
		return ((index % length) + length) % length;
	} else {
		if (index < 0) {
			return 0;
		}

		if (index >= length) {
			return length - 1;
		}
	}

	return index;
}
