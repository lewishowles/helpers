import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper lastDefined
 * @category Array
 * @signature lastDefined(array: any[])
 * @description
 * Returns the last non-undefined element in `array`.
 *
 * @example
 * lastDefined(["a", "b"]); // "b"
 * lastDefined(["a", "b", undefined, undefined]); // "b"
 * lastDefined([]); // undefined
 */
export function lastDefined(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] !== undefined) {
			return array[i];
		}
	}
}
