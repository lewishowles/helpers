import { resolveDateHelperOptions } from "./configure-date-helpers";
import { isTemporalDate } from "./is-temporal-date";
import { parseDate } from "./parse-date";

/**
 * Extract the calendar date parts from a supported date value.
 *
 * @helper getDateParts
 * @category Date
 * @signature getDateParts(value: any, options?: object)
 * @description
 * Convert a `parseDate`-compatible input into `{ year, month, day }`, for use
 * with `<input type="date">`-style three-field date components. Instants and
 * zoned date-times are anchored to the configured or per-call timezone before
 * the calendar date is read.
 *
 * @param  {any}  value
 *     The date value to convert.
 * @param  {object}  options
 *     Per-call date helper options.
 * @param  {string}  options.timeZone
 *     The timezone used when anchoring instants and zoned date-times.
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 * @returns  {object|null}
 *     The year, month and day, or null for an invalid date.
 *
 * @note
 * Invalid or empty input returns `null`.
 *
 * @example
 * getDateParts("2026-06-22"); // { year: 2026, month: 6, day: 22 }
 * getDateParts("2026-06-22T23:30:00Z", { timeZone: "Europe/London" });
 * // { year: 2026, month: 6, day: 23 }
 * getDateParts("not a date"); // null
 */
export function getDateParts(value, options = {}) {
	// The input as a Temporal value, or null when it cannot be parsed.
	const date = parseDate(value, options);

	if (date === null) {
		return null;
	}

	// The calendar date, read in the requested timezone for instants.
	const plainDate = toPlainDate(date, options);

	return {
		day: plainDate.day,
		month: plainDate.month,
		year: plainDate.year,
	};
}

/**
 * Resolve any supported Temporal date value to a plain date.
 *
 * @param  {object}  date
 *     The Temporal date value to convert.
 * @param  {object}  options
 *     Conversion options.
 *
 * @returns  {Temporal.PlainDate}
 *     The calendar date in the configured timezone.
 */
function toPlainDate(date, options) {
	if (isTemporalDate(date, "PlainDate")) {
		return date;
	}

	if (isTemporalDate(date, "PlainDateTime") || isTemporalDate(date, "ZonedDateTime")) {
		return date.toPlainDate();
	}

	// The timezone that decides which calendar day an instant falls on.
	const { timeZone } = resolveDateHelperOptions(options);

	return date.toZonedDateTimeISO(timeZone).toPlainDate();
}
