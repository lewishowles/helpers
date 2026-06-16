import { isNonEmptyArray } from "./is-non-empty-array";
import { isNumber } from "@number";

/**
 * @helper getNextIndex
 * @category Array
 * @signature getNextIndex(index: number, reference: any[], { reverse: boolean = false, wrap: boolean = false })
 * @description
 * Given a starting `index`, determine the next available index in the `reference` array.
 *
 * @note
 * - `reverse` - Reverse the direction, finding the previous index instead
 * - `wrap` - When reaching the end of the array, wrap to the start, and vice-versa
 *
 * If the provided index is outside of the reference array, or the provided index or reference array are unexpected, a default value of `0` is returned.
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
