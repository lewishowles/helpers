import { isPlainObject } from "#object/is-plain-object";
import { parseDate } from "./parse-date";

/**
 * Build a plain date from `{ year, month, day }` parts.
 *
 * @helper toDateFromParts
 * @category Date
 * @signature toDateFromParts(parts: object)
 * @description
 *     Convert `<input type="date">`-style three-field parts into a
 *     `Temporal.PlainDate`. Parts carry no timezone information, so the result
 *     is always a plain date; anchor it with `toEpochMilliseconds`/`formatDate`
 *     when an instant is needed.
 *
 * @param  {object}  parts
 *     The date parts to convert.
 * @param  {number|string}  parts.year
 *     The year.
 * @param  {number|string}  parts.month
 *     The month, `1`-indexed.
 * @param  {number|string}  parts.day
 *     The day of the month.
 * @returns  {Temporal.PlainDate|null}
 *     The parsed plain date, or null for invalid parts.
 *
 * @note
 *     Only a `{ year, month, day }` plain object is accepted; strings,
 *     timestamps, `Date` instances, and Temporal values are rejected. String
 *     parts must be numeric. Missing, non-numeric, or out-of-range parts return
 *     `null`.
 *
 * @example
 * toDateFromParts({ year: 2026, month: 6, day: 22 }); // Temporal.PlainDate
 * toDateFromParts({ year: 2026, month: 2, day: 30 }); // null
 */
export function toDateFromParts(parts) {
	if (!isPlainObject(parts)) {
		return null;
	}

	return parseDate(parts);
}
