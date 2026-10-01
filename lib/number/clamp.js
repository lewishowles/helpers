import { validateOrFallback } from "#general/validate-or-fallback";
import { isNumber } from "./is-number";

// The lower bound when no valid minimum is given. A value that is not a number
// is also treated as this.
const defaultMinimum = 0;
// The upper bound when no valid maximum is given.
const defaultMaximum = 100;

/**
 * Keep a number within the specified bounds.
 *
 * @helper clamp
 * @category Number
 * @signature clamp(value: number, minimum: number, maximum: number)
 * @description
 *     Ensure that the provided `value` is between `minimum` and `maximum`
 *     (inclusive). If `value` is lower than `minimum`, `minimum` is returned.
 *     If `value` is higher than `maximum`, `maximum` is returned.
 *
 * @param  {number}  value
 *     The number to clamp.
 * @param  {number}  minimum
 *     The lowest allowed value.
 * @param  {number}  maximum
 *     The highest allowed value.
 * @returns  {number}
 *     The value within the validated bounds.
 *
 * @note
 *     A `value` that is not a number is treated as `0` before clamping.
 *
 * @example
 * clamp(4); // 4
 * clamp(10, 0, 5); // 5
 * clamp(-15, 0, 5); // 0
 * clamp(NaN); // 0
 */
export function clamp(value, minimum = defaultMinimum, maximum = defaultMaximum) {
	// The value falls back to zero when it is invalid.
	const internalValue = validateOrFallback(value, isNumber, defaultMinimum);
	// An invalid minimum falls back to the default lower bound.
	const internalMinimum = validateOrFallback(minimum, isNumber, defaultMinimum);
	// An invalid maximum falls back to the default upper bound.
	const internalMaximum = validateOrFallback(maximum, isNumber, defaultMaximum);

	if (internalValue < internalMinimum) {
		return internalMinimum;
	}

	if (internalValue > internalMaximum) {
		return internalMaximum;
	}

	return internalValue;
}
