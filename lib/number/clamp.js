import { validateOrFallback } from "@general";
import { isNumber } from "./is-number";

const defaultMinimum = 0;
const defaultMaximum = 100;

/**
 * Ensure that a given number is bound by the provided minimum and maximum
 * values.
 *
 * clamp(1, 0, 10); // 1
 * clamp(-1, 0, 10); // 0
 * clamp(11, 0, 10); // 10
 *
 * @param  {number}  value
 *     The number to clamp.
 * @param  {number}  minimum
 *     The minimum value to allow.
 * @param  {number}  maximum
 *     The maximum value to allow.
 */
export function clamp(value, minimum = defaultMinimum, maximum = defaultMaximum) {
	const internalValue = validateOrFallback(value, isNumber, defaultMinimum);
	const internalMinimum = validateOrFallback(minimum, isNumber, defaultMinimum);
	const internalMaximum = validateOrFallback(maximum, isNumber, defaultMaximum);

	if (internalValue < internalMinimum) {
		return internalMinimum;
	}

	if (internalValue > internalMaximum) {
		return internalMaximum;
	}

	return internalValue;
}
