/**
 * Calculate a percentage from a value and its total.
 *
 * @helper toPercentage
 * @category Number
 * @signature toPercentage(value: any, total: any)
 * @description
 *     Calculates the percentage of `value` relative to `total`, returning `0`
 *     when `total` is zero or falsy to avoid division by zero. Non-numeric
 *     inputs are coerced; `NaN` or `Infinity` inputs return `0`. The result is
 *     not clamped, so a `value` exceeding `total` will produce a percentage
 *     above 100.
 *
 * @param  {any}  value
 *     The value to convert to a percentage.
 * @param  {any}  total
 *     The total value that represents 100%.
 * @returns  {number}
 *     The percentage, or zero when the inputs cannot produce a finite result.
 *
 * @example
 * toPercentage(25, 100); // 25
 * toPercentage(1, 4); // 25
 * toPercentage(10, 0); // 0
 * toPercentage(10, null); // 0
 */
export function toPercentage(value, total) {
	// The value as a number, so numeric strings work too.
	const numerator = Number(value);
	// The total as a number.
	const denominator = Number(total);

	if (!denominator || !Number.isFinite(numerator) || !Number.isFinite(denominator)) {
		return 0;
	}

	return (numerator / denominator) * 100;
}
