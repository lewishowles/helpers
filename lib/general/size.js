import { arrayLength, isNonEmptyArray } from "@array";
import { isNonEmptyObject, objectLength } from "@object";
import { isNumber } from "@number";

/**
 * Determine the size of the given value. For strings, the length of the string
 * is used. For numbers, the size corresponds to the value. For arrays, its the
 * length of the array, and for objects, it's the number of properties at the
 * top level.
 *
 * Returns zero if no reasonable length can be determined.
 *
 * @param  {unknown}  variable
 *     The variable to test.
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
