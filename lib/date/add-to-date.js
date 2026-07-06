import { Temporal } from "temporal-polyfill";
import { isNonEmptyString } from "../string/is-non-empty-string";
import { parseDate } from "./parse-date";

// Valid calendar units for addToDate.
const validUnits = ["day", "week", "month", "year"];

/**
 * @helper addToDate
 * @category Date
 * @signature addToDate(value: any, amount: number, unit: "day" | "week" | "month" | "year", options?: object)
 * @description
 * Shift a `parseDate`-compatible value by a calendar amount and unit, returning
 * a new Temporal value of the same precision as the input. Negative amounts
 * subtract; `0` returns an equivalent value for the same day.
 *
 * @param  {any}  value
 *     The date value to shift.
 * @param  {number}  amount
 *     The integer amount to shift by. Negative values subtract.
 * @param  {("day"|"week"|"month"|"year")}  unit
 *     The calendar unit to shift by.
 * @param  {object}  options
 *     Per-call date helper options (passed through to `parseDate`).
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 *
 * @note
 * Month and year addition uses Temporal's default `constrain` overflow
 * behaviour: out-of-range days are clamped to the last valid day of the target
 * month (e.g. 31 January + 1 month = 28 February).
 *
 * @note
 * `Temporal.Instant` values return `null` because instants have no calendar and
 * cannot accept calendar-unit arithmetic. Anchor to a timezone first if you
 * need to shift an instant.
 *
 * @example
 * addToDate("2026-07-06", 1, "day"); // Temporal.PlainDate 2026-07-07
 * addToDate("2026-07-06T10:15:30", -3, "day"); // Temporal.PlainDateTime 2026-07-03T10:15:30
 * addToDate("2026-07-06T10:00:00[Europe/London]", 2, "week"); // Temporal.ZonedDateTime 2026-07-20T10:00:00+01:00[Europe/London]
 */
export function addToDate(value, amount, unit, options = {}) {
	if (!isNonEmptyString(unit) || !validUnits.includes(unit)) {
		return null;
	}

	if (!Number.isInteger(amount)) {
		return null;
	}

	const parsed = parseDate(value, options);

	if (parsed === null) {
		return null;
	}

	if (parsed instanceof Temporal.Instant) {
		return null;
	}

	return parsed.add({ [`${unit}s`]: amount });
}
