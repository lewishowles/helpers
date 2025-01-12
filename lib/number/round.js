import { isNumber } from "./is-number";

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param  {number}  value
 *     The number to round.
 * @param  {number}  decimals
 *     The number of decimal places to round to.
 * @returns  {number}
 *     The rounded number.
 */
export function round(value, decimals) {
	if (!isNumber(value) || !isNumber(decimals)) {
		throw new TypeError("Both arguments must be numbers");
	}

	if (!Number.isFinite(value) || !Number.isFinite(decimals)) {
		throw new RangeError("Both arguments must be finite numbers");
	}

	const factor = Math.pow(10, decimals);

	return Math.round(value * factor) / factor;
}
