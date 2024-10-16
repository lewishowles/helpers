import { isFunction } from "@general";
import { isNumber } from "@number";
import { isObject } from "@object";

/**
 * Validate the provided value against the provided comparison function or
 * keyword, returning the fallback value if the comparison fails.
 *
 * Available comparison keywords are:
 * - "string": A string, including an empty string
 * - "boolean": Strictly true or false
 * - "number": A number, excluding NaN, based on `isNumber`
 * - "function": A function, based on `isFunction`
 * - "array": An array, including an empty array
 * - "object": An object, including an empty object
 *
 * If a comparison function is provided, the variable will be provided as the
 * first parameter, and if the function returns strictly `true` the provided
 * variable is returned, otherwise the fallback is returned.
 *
 * @param  {mixed}  variable
 *     The variable to check.
 * @param  {mixed}  comparison
 *     The comparison function or keyword to use against the provided variable.
 * @param  {mixed}  fallback
 *     The fallback value to use if the comparison fails.
 */
export function validateOrFallback(variable, comparison, fallback) {
	// Start by determining the most appropriate comparison function.
	let comparisonFunction = comparison;

	switch(true) {
		case comparison === "string":
		case comparison === "boolean":
			comparisonFunction = value => typeof value === comparison;

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
