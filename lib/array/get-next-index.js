import { isNumber } from "#number/is-number";
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
 *     The starting index to move from.
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
 * An invalid index or reference array returns `0`.
 *
 * @example
 * getNextIndex(3, ["A", "B", "C", "D"]); // 3
 * getNextIndex(3, ["A", "B", "C", "D"], { wrap: true }); // 0
 * getNextIndex(3, ["A", "B", "C", "D"], { reverse: true }); // 2
 */
export function getNextIndex(index, reference, { reverse = false, wrap = false } = {}) {
	if (!isNumber(index) || !isNonEmptyArray(reference)) {
		return 0;
	}

	// The number of items, used to clamp or wrap the index.
	const length = reference.length;

	if (reverse) {
		index--;
	} else {
		index++;
	}

	// When wrapping, we want to find the appropriate index regardless of what
	// index is provided. If necessary, we keep wrapping around the array until
	// we land within it.
	if (wrap) {
		// Whether the index moved below zero, so it is counted back from the
		// end once wrapped.
		let negative = false;

		// When dealing with negative numbers, modulo behaves surprisingly, so
		// we perform a regular modulo and make a note for later.
		if (index < 0) {
			negative = true;
			index = Math.abs(index);
		}

		if (index >= length) {
			index = index % length;
		}

		// If we made a note for later, since we're working backwards, we want
		// to take the index we landed on from our length to find the correct
		// number.
		if (negative) {
			index = length - index;
		}

		return index;
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
