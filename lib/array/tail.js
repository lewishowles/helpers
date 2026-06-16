import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper tail
 * @category Array
 * @signature tail(array: any[])
 * @description
 * Returns the last element in `array`.
 *
 * @example
 * tail(["a", "b"]); // "b"
 * tail([]); // undefined
 */
export function tail(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[array.length - 1];
}
