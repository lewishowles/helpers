import { parseDate } from "./parse-date";
import { resolveDateHelperOptions } from "./configure-date-helpers";
import { Temporal } from "temporal-polyfill";

/**
 * Convert a supported date value into epoch milliseconds.
 *
 * @helper toEpochMilliseconds
 * @category Date
 * @signature toEpochMilliseconds(value: any, options?: object)
 * @description
 * Convert a supported date input into epoch milliseconds. Plain dates and
 * plain date-times use the configured timezone.
 *
 * @example
 * toEpochMilliseconds("22/06/2026");
 * toEpochMilliseconds("06/22/2026", { inputFormat: "MM/DD/YYYY", timeZone: "America/New_York" });
 */
export function toEpochMilliseconds(value, options = {}) {
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
 */
function temporalDateToEpochMilliseconds(date, options = {}) {
	const { timeZone } = resolveDateHelperOptions(options);

	if (date instanceof Temporal.Instant) {
		return date.epochMilliseconds;
	}

	if (date instanceof Temporal.ZonedDateTime) {
		return date.toInstant().epochMilliseconds;
	}

	if (date instanceof Temporal.PlainDate) {
		return date
			.toPlainDateTime(Temporal.PlainTime.from("00:00"))
			.toZonedDateTime(timeZone)
			.toInstant().epochMilliseconds;
	}

	if (date instanceof Temporal.PlainDateTime) {
		return date.toZonedDateTime(timeZone).toInstant().epochMilliseconds;
	}

	return null;
}
