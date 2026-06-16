import { validateOrFallback } from "@general";
import { isNumber } from "./is-number";

const defaultMinimum = 0;
const defaultMaximum = 100;

/**
 * @helper clamp
 * @category Number
 * @signature clamp(number: number, minimum: number, maximum: number)
 * @description
 * Ensure that the provided `number` is between `minimum` and `maximum` (inclusive). If `number` is lower than `minimum`, `minimum` is returned. If `number` is higher than maximum, `maximum` is returned.
 *
 * @note
 * If `number` is not a number, `minimum` is returned.
 *
 * @example
 * clamp(4); // 4
 * clamp(10, 0, 5); // 5
 * clamp(-15, 0, 5); // 0
 * clamp(NaN); // 0
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
