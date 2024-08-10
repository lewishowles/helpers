import { isNumber } from "./number.js";

/**
 * Get the next index, given the current index and the reference list.
 *
 * If the provided index is outside of the reference array, or the provided
 * index or reference array are unexpected, a default value of 0 is returned.
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

	// If our index is outside of the array, reset to the first element.
	if (index < 0 || index >= length) {
		return 0;
	}

	if (reverse) {
		index--;
	} else {
		index++;
	}

	if (wrap) {
		if (index < 0) {
			return length - 1;
		}

		if (index >= length) {
			return 0;
		}
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

/**
 * Determine whether the given variable is an array and has at least one entry.
 *
 * @param  {mixed}  variable
 *	 The variable to test.
 */
export function isNonEmptyArray(variable) {
	return Array.isArray(variable) && variable.length > 0;
}
