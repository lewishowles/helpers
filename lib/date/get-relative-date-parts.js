import { toEpochMilliseconds } from "./to-epoch-milliseconds";

// Relative units supported by Intl.RelativeTimeFormat.
const relativeUnits = {
	SECOND: "second",
	MINUTE: "minute",
	HOUR: "hour",
	DAY: "day",
	WEEK: "week",
	MONTH: "month",
	YEAR: "year",
};

// Millisecond thresholds for supported relative units.
const relativeUnitMilliseconds = {
	SECOND: 1000,
	MINUTE: 60 * 1000,
	HOUR: 60 * 60 * 1000,
	DAY: 24 * 60 * 60 * 1000,
	WEEK: 7 * 24 * 60 * 60 * 1000,
	MONTH: 30 * 24 * 60 * 60 * 1000,
	YEAR: 365 * 24 * 60 * 60 * 1000,
};

/**
 * Get the relative value and unit between two dates.
 *
 * @helper getRelativeDateParts
 * @category Date
 * @signature getRelativeDateParts(value: any, relativeTo?: any, options?: object)
 * @description
 * Convert two supported dates into relative date parts for use with
 * `Intl.RelativeTimeFormat` or custom UI rendering.
 *
 * @example
 * getRelativeDateParts("2026-06-22T10:00:00", "2026-06-22T10:01:00");
 * // { value: -1, unit: "minute" }
 */
export function getRelativeDateParts(value, relativeTo = Date.now(), options = {}) {
	const epochMilliseconds = toEpochMilliseconds(value, options);
	const relativeToEpochMilliseconds = toEpochMilliseconds(relativeTo, options);

	if (epochMilliseconds === null || relativeToEpochMilliseconds === null) {
		return null;
	}

	const difference = epochMilliseconds - relativeToEpochMilliseconds;

	if (Math.abs(difference) < 1000) {
		return {
			unit: relativeUnits.SECOND,
			value: 0,
		};
	}

	const absoluteDifference = Math.abs(difference);
	const direction = difference > 0 ? 1 : -1;
	const { amount, unit } = getRelativeDateAmount(absoluteDifference);

	return {
		unit,
		value: direction * amount,
	};
}

/**
 * Get the best relative unit for an absolute time difference.
 *
 * @param  {number}  difference
 *     The absolute difference between two dates, as milliseconds.
 */
function getRelativeDateAmount(difference) {
	const seconds = Math.floor(difference / relativeUnitMilliseconds.SECOND);

	if (seconds < 60) {
		return { amount: seconds, unit: relativeUnits.SECOND };
	}

	const minutes = Math.floor(difference / relativeUnitMilliseconds.MINUTE);

	if (minutes < 60) {
		return { amount: minutes, unit: relativeUnits.MINUTE };
	}

	const hours = Math.floor(difference / relativeUnitMilliseconds.HOUR);

	if (hours < 24) {
		return { amount: hours, unit: relativeUnits.HOUR };
	}

	const days = Math.floor(difference / relativeUnitMilliseconds.DAY);

	if (days < 7) {
		return { amount: Math.max(1, days), unit: relativeUnits.DAY };
	}

	if (days < 30) {
		return { amount: Math.floor(days / 7), unit: relativeUnits.WEEK };
	}

	const months = Math.floor(difference / relativeUnitMilliseconds.MONTH);

	if (months < 12) {
		return { amount: months, unit: relativeUnits.MONTH };
	}

	return {
		amount: Math.floor(difference / relativeUnitMilliseconds.YEAR),
		unit: relativeUnits.YEAR,
	};
}
