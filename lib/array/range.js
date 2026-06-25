import { isNumber } from "../number/is-number";

/**
 * @helper range
 * @category Array
 * @signature range(start: number, end?: number, step?: number)
 * @description
 * Generate a numeric array from `start` to `end`, both inclusive. When called
 * with a single argument, `start` is treated as `end` and the range begins at
 * `0`. Direction is inferred automatically when `start > end` and no `step` is
 * given; an explicit `step` overrides it. A zero `step` returns an empty array.
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

	const result = [];

	for (let i = start; ascending ? i <= end : i >= end; i += step) {
		result.push(i);
	}

	return result;
}
