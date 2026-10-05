import { isNonEmptyString } from "#string/is-non-empty-string";
import { resolveDateHelperOptions } from "./configure-date-helpers";
import { toEpochMilliseconds } from "./to-epoch-milliseconds";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format a supported date value.
 *
 * @helper formatDate
 * @category Date
 * @signature formatDate(value: any, format?: string|object, options?: object)
 * @description
 * Format supported date input using a named configured format, a Day.js-style
 * token string, or `Intl.DateTimeFormat` options.
 *
 * @param  {any}  value
 *     The date value to format.
 * @param  {string | object}  format
 *     The named format, Day.js token string, or Intl format options to use.
 * @param  {object}  options
 *     Per-call date helper options.
 * @param  {string}  options.locale
 *     The BCP 47 locale used by Intl formatters.
 * @param  {string}  options.timeZone
 *     The timezone used when anchoring plain dates and date-times.
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 * @param  {string}  options.defaultFormat
 *     The named format used when `format` is omitted.
 * @param  {object}  options.formats
 *     The named Day.js token or Intl format options available by key.
 * @returns  {string|null}
 *     The formatted date, or null for an invalid date.
 *
 * @example
 * formatDate("22/06/2026");
 * formatDate("22/06/2026", "shortDate");
 * formatDate("2026-06-22", { year: "numeric", month: "long", day: "2-digit" });
 */
export function formatDate(value, format, options = {}) {
	// The configured date defaults with any per-call options applied.
	const resolvedOptions = resolveDateHelperOptions(options);
	// The date as epoch milliseconds, which token and Intl formatting both use.
	const epochMilliseconds = toEpochMilliseconds(value, resolvedOptions);

	if (epochMilliseconds === null) {
		return null;
	}

	// The format as a token string or Intl options, with named formats looked
	// up.
	const resolvedFormat = resolveDateFormat(format, resolvedOptions);

	if (isNonEmptyString(resolvedFormat)) {
		return formatDateWithTokens(epochMilliseconds, resolvedFormat, resolvedOptions);
	}

	return formatDateWithIntl(epochMilliseconds, resolvedFormat, resolvedOptions);
}

/**
 * Resolve a named, token, or Intl format.
 *
 * @param  {string|object}  format
 *     The requested format.
 * @param  {object}  options
 *     The resolved date helper options.
 *
 * @returns  {string|object}
 *     The named format value or the supplied format.
 */
function resolveDateFormat(format, options) {
	if (format === undefined || format === null) {
		return options.formats[options.defaultFormat];
	}

	if (isNonEmptyString(format) && options.formats[format] !== undefined) {
		return options.formats[format];
	}

	return format;
}

/**
 * Format a date with Day.js-style tokens.
 *
 * @param  {number}  epochMilliseconds
 *     The date as epoch milliseconds.
 * @param  {string}  format
 *     The token format to use.
 * @param  {object}  options
 *     Formatting options.
 *
 * @returns  {string}
 *     The date formatted with Day.js tokens.
 */
function formatDateWithTokens(epochMilliseconds, format, options) {
	return dayjs(epochMilliseconds).tz(options.timeZone).format(format);
}

/**
 * Format a date with Intl options.
 *
 * @param  {number}  epochMilliseconds
 *     The date as epoch milliseconds.
 * @param  {object}  format
 *     The Intl format options to use.
 * @param  {object}  options
 *     Formatting options.
 *
 * @returns  {string}
 *     The date formatted with Intl options.
 */
function formatDateWithIntl(epochMilliseconds, format = {}, options) {
	return new Intl.DateTimeFormat(options.locale, {
		timeZone: options.timeZone,
		...format,
	}).format(new Date(epochMilliseconds));
}
