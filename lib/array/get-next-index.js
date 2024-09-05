import { isNonEmptyArray } from "./is-non-empty-array";
import { isNumber } from "@number";

/**
 * Get the next index, given the current index and the reference list.
 *
 * If the provided index is outside of the reference array, or the provided
 * index or reference array are unexpected, a default value of 0 is returned.
 *
 * getNextIndex(3, ['A', 'B', 'C', 'D']); // 3
 * getNextIndex(3, ['A', 'B', 'C', 'D'], { wrap: true }); // 0
 * getNextIndex(3, ['A', 'B', 'C', 'D'], { reverse: true }); // 2
 *
 * @param  {number}  index
 *	 The current index.
 * @param  {array}  reference
 *	 The reference list.
 * @param  {boolean}  options.reverse
 *	 Whether to reverse direction, decreasing the index.
 * @param  {boolean}  options.wrap
 *	 Whether to wrap to the other end of the list if at the end.
 */
export function getNextIndex(index, reference, { reverse = false, wrap = false } = {}) {
	if (!isNumber(index) || !isNonEmptyArray(reference)) {
		return 0;
	}

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
