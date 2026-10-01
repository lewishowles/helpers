import { resolveDateHelperOptions } from "./configure-date-helpers";
import { isTemporalDate } from "./is-temporal-date";
import { parseDate } from "./parse-date";
import { Temporal } from "temporal-polyfill";

/**
 * Convert a supported date value into epoch milliseconds.
 *
 * @helper toEpochMilliseconds
 * @category Date
 * @signature toEpochMilliseconds(value: any, options?: object)
 * @description
 *     Convert a supported date input into epoch milliseconds. Plain dates and
 *     plain date-times use the configured timezone.
 *
 * @param  {any}  value
 *     The date value to convert.
 * @param  {object}  options
 *     Per-call date helper options.
 * @param  {string}  options.timeZone
 *     The timezone used when anchoring plain dates and date-times.
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 * @returns  {number|null}
 *     Epoch milliseconds, or null for an invalid date.
 *
 * @example
 * toEpochMilliseconds("22/06/2026");
 * toEpochMilliseconds("06/22/2026", { inputFormat: "MM/DD/YYYY", timeZone: "America/New_York" });
 */
export function toEpochMilliseconds(value, options = {}) {
	// The input as a Temporal value, or null when it cannot be parsed.
	const date = parseDate(value, options);

	if (date === null) {
		return null;
	}

	return temporalDateToEpochMilliseconds(date, options);
}

/**
 * Convert a Temporal date value into epoch milliseconds.
 *
 * @param  {object}  date
 *     The Temporal date value to convert.
 * @param  {object}  options
 *     Conversion options.
 *
 * @returns  {number|null}
 *     Epoch milliseconds, or null for an unsupported Temporal value.
 */
function temporalDateToEpochMilliseconds(date, options = {}) {
	// The timezone that turns a plain date or date-time into an instant.
	const { timeZone } = resolveDateHelperOptions(options);

	if (isTemporalDate(date, "Instant")) {
		return date.epochMilliseconds;
	}

	if (isTemporalDate(date, "ZonedDateTime")) {
		return date.toInstant().epochMilliseconds;
	}

	if (isTemporalDate(date, "PlainDate")) {
		return date
			.toPlainDateTime(Temporal.PlainTime.from("00:00"))
			.toZonedDateTime(timeZone)
			.toInstant().epochMilliseconds;
	}

	if (isTemporalDate(date, "PlainDateTime")) {
		return date.toZonedDateTime(timeZone).toInstant().epochMilliseconds;
	}

	return null;
}
