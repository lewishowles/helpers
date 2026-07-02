import { isNonEmptyString } from "../string/is-non-empty-string";
import { isPlainObject } from "../object/is-plain-object";
import { resolveDateHelperOptions } from "./configure-date-helpers";
import { Temporal } from "temporal-polyfill";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Tokens that make a formatted date include time information.
const timeFormatTokens = /(^|[^A-Za-z])[HhmsSAaZzXx]/;

/**
 * Parse a supported date value into a Temporal date type.
 *
 * @helper parseDate
 * @category Date
 * @signature parseDate(value: any, options?: object)
 * @description
 * Convert `Date`, timestamp, Temporal, ISO/RFC 9557 string, configured
 * token-format string, or `{ year, month, day }` parts object into a
 * Temporal date value.
 *
 * @param  {any}  value
 *     The date value to parse.
 * @param  {object}  options
 *     Per-call date helper options.
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 *
 * @note
 * Token strings use Day.js-style tokens such as `DD/MM/YYYY`. Invalid or empty
 * values return `null`. Parts objects are rejected (not clamped) when the
 * month or day is out of range, e.g. `{ year: 2026, month: 2, day: 30 }`.
 *
 * @example
 * parseDate("2026-06-22"); // Temporal.PlainDate
 * parseDate("2026-06-22T10:15:30Z"); // Temporal.Instant
 * parseDate("22/06/2026 10:15", { inputFormat: "DD/MM/YYYY HH:mm" }); // Temporal.PlainDateTime
 * parseDate({ year: 2026, month: 6, day: 22 }); // Temporal.PlainDate
 */
export function parseDate(value, options = {}) {
	try {
		return parseDateValue(value, options);
	} catch {
		return null;
	}
}

/**
 * Parse a value without swallowing unsupported Temporal parsing errors.
 *
 * @param  {any}  value
 *     The value to parse.
 * @param  {object}  options
 *     Parsing options.
 */
function parseDateValue(value, options) {
	if (value instanceof Date) {
		return parseDateInstance(value);
	}

	if (typeof value === "number") {
		return parseTimestamp(value);
	}

	if (isTemporalDate(value)) {
		return value;
	}

	if (isNonEmptyString(value)) {
		return parseStringDate(value, options);
	}

	if (isPlainObject(value)) {
		return parseDateParts(value);
	}

	return null;
}

/**
 * Parse a `{ year, month, day }` parts object as a plain date.
 *
 * @param  {object}  value
 *     The date parts to parse.
 */
function parseDateParts(value) {
	return Temporal.PlainDate.from(
		{
			day: Number(value.day),
			month: Number(value.month),
			year: Number(value.year),
		},
		{ overflow: "reject" },
	);
}

/**
 * Parse a JavaScript Date instance as an instant.
 *
 * @param  {Date}  value
 *     The date instance to parse.
 */
function parseDateInstance(value) {
	if (Number.isNaN(value.getTime())) {
		return null;
	}

	return Temporal.Instant.fromEpochMilliseconds(value.getTime());
}

/**
 * Parse an epoch millisecond timestamp as an instant.
 *
 * @param  {number}  value
 *     The timestamp to parse.
 */
function parseTimestamp(value) {
	if (!Number.isFinite(value)) {
		return null;
	}

	return Temporal.Instant.fromEpochMilliseconds(value);
}

/**
 * Parse a string date using Temporal first, then configured token parsing.
 *
 * @param  {string}  value
 *     The date string to parse.
 * @param  {object}  options
 *     Parsing options.
 */
function parseStringDate(value, options) {
	const dateString = value.trim();
	const temporalDate = parseTemporalString(dateString);

	if (temporalDate !== null) {
		return temporalDate;
	}

	return parseFormattedString(dateString, options);
}

/**
 * Parse ISO and RFC 9557 strings with Temporal.
 *
 * @param  {string}  value
 *     The date string to parse.
 */
function parseTemporalString(value) {
	try {
		if (value.includes("[")) {
			return Temporal.ZonedDateTime.from(value);
		}

		if (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)) {
			return Temporal.Instant.from(value);
		}

		if (value.includes("T")) {
			return Temporal.PlainDateTime.from(value);
		}

		return Temporal.PlainDate.from(value);
	} catch {
		return null;
	}
}

/**
 * Parse a string date with the configured token format.
 *
 * @param  {string}  value
 *     The date string to parse.
 * @param  {object}  options
 *     Parsing options.
 */
function parseFormattedString(value, options) {
	const { inputFormat } = resolveDateHelperOptions(options);

	if (!isNonEmptyString(inputFormat)) {
		return null;
	}

	const parsedDate = dayjs(value, inputFormat, true);

	if (!parsedDate.isValid()) {
		return null;
	}

	if (!formatIncludesTime(inputFormat)) {
		return Temporal.PlainDate.from({
			day: parsedDate.date(),
			month: parsedDate.month() + 1,
			year: parsedDate.year(),
		});
	}

	return Temporal.PlainDateTime.from({
		day: parsedDate.date(),
		hour: parsedDate.hour(),
		millisecond: parsedDate.millisecond(),
		minute: parsedDate.minute(),
		month: parsedDate.month() + 1,
		second: parsedDate.second(),
		year: parsedDate.year(),
	});
}

/**
 * Check whether a token format includes time fields.
 *
 * @param  {string}  format
 *     The token format to inspect.
 */
function formatIncludesTime(format) {
	return timeFormatTokens.test(format);
}

/**
 * Check whether a value is a supported Temporal type.
 *
 * @param  {any}  value
 *     The value to inspect.
 */
function isTemporalDate(value) {
	return [
		Temporal.Instant,
		Temporal.PlainDate,
		Temporal.PlainDateTime,
		Temporal.ZonedDateTime,
	].some((TemporalType) => value instanceof TemporalType);
}
