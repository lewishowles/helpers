import { isNumber } from "#number/is-number";

/**
 * Build a range of numbers with an optional step.
 *
 * @helper range
 * @category Array
 * @signature range(start: number, end?: number, step?: number)
 * @description
 * Generate a numeric array from `start` to `end`, both inclusive. When called
 * with a single argument, `start` is treated as `end` and the range begins at
 * `0`. Direction is inferred automatically when `start > end` and no `step` is
 * given; an explicit `step` overrides it. A zero `step` returns an empty array.
 *
 * @param  {number}  start
 *     The first number in the range, or the end value when called with one
 *     argument.
 * @param  {number}  end
 *     The final number to include in the range.
 * @param  {number}  step
 *     The amount to change by between each number.
 * @returns  {number[]}
 *     The inclusive range, or an empty array for invalid inputs.
 *
 * @example
 * range(5);        // [0, 1, 2, 3, 4, 5]
 * range(1, 5);     // [1, 2, 3, 4, 5]
 * range(0, 10, 2); // [0, 2, 4, 6, 8, 10]
 * range(5, 0);     // [5, 4, 3, 2, 1, 0]
 * range(5, 0, -1); // [5, 4, 3, 2, 1, 0]
 */
export function range(start, end, step) {
	if (!isNumber(start)) {
		return [];
	}

	if (end === undefined) {
		end = start;
		start = 0;
	}

	if (!isNumber(end)) {
		return [];
	}

	// The endpoints determine the default direction.
	const ascending = start <= end;

	if (step === undefined) {
		step = ascending ? 1 : -1;
	}

	if (!isNumber(step) || step === 0) {
		return [];
	}

	if ((ascending && step < 0) || (!ascending && step > 0)) {
		return [];
	}

	// The numbers in the range, in order.
	const result = [];

	for (let i = start; ascending ? i <= end : i >= end; i += step) {
		result.push(i);
	}

	return result;
}
