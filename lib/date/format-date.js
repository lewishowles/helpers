import { isNonEmptyString } from "../string/is-non-empty-string";
import { resolveDateHelperOptions } from "./configure-date-helpers";
import { toEpochMilliseconds } from "./to-epoch-milliseconds";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
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
 * @example
 * formatDate("22/06/2026");
 * formatDate("22/06/2026", "shortDate");
 * formatDate("2026-06-22", { year: "numeric", month: "long", day: "2-digit" });
 */
export function formatDate(value, format, options = {}) {
	const resolvedOptions = resolveDateHelperOptions(options);
	const epochMilliseconds = toEpochMilliseconds(value, resolvedOptions);

	if (epochMilliseconds === null) {
		return null;
	}

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
 */
function formatDateWithIntl(epochMilliseconds, format = {}, options) {
	return new Intl.DateTimeFormat(options.locale, {
		timeZone: options.timeZone,
		...format,
	}).format(new Date(epochMilliseconds));
}
