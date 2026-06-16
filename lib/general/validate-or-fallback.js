import { isFunction } from "./is-function";
import { isNumber } from "@number";
import { isObject } from "@object";

/**
 * @helper validateOrFallback
 * @category General
 * @signature validateOrFallback(value: any, comparison: function | string, fallback: any)
 * @description
 * Apply `comparison` to the provided `value`, returning `value` if `true`, and `fallback` if not.
 *
 * @note
 * `comparison` can be a function, or one of the keywords:
 *
 * - `string`: A string, including an empty string
 * - `boolean`: Strictly true or false
 * - `number`: A number, excluding NaN, based on `isNumber`
 * - `function`: A function, based on `isFunction`
 * - `array`: An array, including an empty array
 * - `object`: An object, including an empty object
 *
 * @example
 * validateOrFallback("value", "string", "fallback"); // "value"
 * validateOrFallback({}, isNonEmptyObject, null); // null
 * validateOrFallback(5, "number", 0); // 5
 */
export function validateOrFallback(variable, comparison, fallback) {
	// Start by determining the most appropriate comparison function.
	let comparisonFunction = comparison;

	switch (true) {
		case comparison === "string":
		case comparison === "boolean":
			comparisonFunction = (value) => typeof value === comparison;

			break;
		case comparison === "number":
			comparisonFunction = isNumber;

			break;
		case comparison === "function":
			comparisonFunction = isFunction;

			break;
		case comparison === "array":
			comparisonFunction = Array.isArray;

			break;
		case comparison === "object":
			comparisonFunction = isObject;

			break;
	}

	// If we haven't landed on a function, we can only return the fallback.
	if (!isFunction(comparisonFunction)) {
		return fallback;
	}

	// Our comparison must strictly return true to pass.
	if (comparisonFunction(variable) === true) {
		return variable;
	}

	return fallback;
}
