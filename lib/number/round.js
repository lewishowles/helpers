import { isNumber } from "./is-number";

/**
 * @helper round
 * @category Number
 * @signature round(number: number, precision: number = 0)
 * @description
 * Rounds the given `number` to the specified `precision`. If `precision` is not provided, it defaults to 0.
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

	const factor = Math.pow(10, decimals);

	return Math.round(value * factor) / factor;
}
