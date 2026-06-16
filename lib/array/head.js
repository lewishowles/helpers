import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper head
 * @category Array
 * @signature head(array: any[])
 * @description
 * Returns the first element in `array`.
 *
 * @example
 * head(["a", "b"]); // "a"
 * head([]); // undefined
 */
export function head(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[0];
}
