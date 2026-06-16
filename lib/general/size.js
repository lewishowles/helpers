import { arrayLength, isNonEmptyArray } from "@array";
import { isNonEmptyObject, objectLength } from "@object";
import { isNumber } from "@number";

/**
 * @helper size
 * @category General
 * @signature size(variable: any)
 * @description
 * Determine the size of the given `variable`. For strings, the number of characters is used; for numbers, the value itself; for arrays, the length; for objects, the number of top-level properties. Returns `0` if no reasonable size can be determined.
 *
 * @example
 * size("hello"); // 5
 * size(42); // 42
 * size([1, 2, 3]); // 3
 * size({ a: 1, b: 2 }); // 2
 * size(null); // 0
 */
export function size(variable) {
	if (typeof variable === "string") {
		return variable.length;
	}

	if (isNumber(variable)) {
		return variable;
	}

	if (isNonEmptyArray(variable)) {
		return arrayLength(variable);
	}

	if (isNonEmptyObject(variable)) {
		return objectLength(variable);
	}

	return 0;
}
