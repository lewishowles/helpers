import { isNumber } from "./is-number";

/**
 * Round a finite number to a chosen decimal place.
 *
 * @helper round
 * @category Number
 * @signature round(value: number, decimals: number = 0)
 * @description
 * Rounds the given `value` to the specified number of `decimals`. If `decimals`
 * is not provided, it defaults to 0.
 *
 * @param  {number}  value
 *     The number to round.
 * @param  {number}  decimals
 *     The number of decimal places to keep.
 * @returns  {number}
 *     The rounded number.
 * @throws  {TypeError}
 *     When either argument is not a number.
 * @throws  {RangeError}
 *     When either argument is not finite.
 *
 * @example
 * round(4.567); // 5
 * round(4.567, 2); // 4.57
 * round(4.567, 0); // 5
 * round(4.567, -1); // 0
 */
export function round(value, decimals) {
	if (!isNumber(value) || !isNumber(decimals)) {
		throw new TypeError("Both arguments must be numbers");
	}

	if (!Number.isFinite(value) || !Number.isFinite(decimals)) {
		throw new RangeError("Both arguments must be finite numbers");
	}

	// The power of ten that moves the requested decimal place to the integer
	// position.
	const factor = Math.pow(10, decimals);

	return Math.round(value * factor) / factor;
}
