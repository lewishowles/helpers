import { resolveDateHelperOptions } from "./configure-date-helpers";
import { getRelativeDateParts } from "./get-relative-date-parts";

// The Intl relative time formatters built so far, keyed by locale, so calls in
// the same locale share one formatter.
const relativeTimeFormatters = new Map();

/**
 * Format a supported date value relative to another date.
 *
 * @helper formatRelativeDate
 * @category Date
 * @signature formatRelativeDate(value: any, relativeTo?: any, options?: object)
 * @description
 * Show dates as `3 minutes ago` or `in 2 days`. Each locale's Intl formatter is
 * kept and reused for later calls, and is never released.
 *
 * @param  {any}  value
 *     The date value to format.
 * @param  {any}  relativeTo
 *     The date value to compare against.
 * @param  {object}  options
 *     Per-call date helper options.
 * @param  {string}  options.locale
 *     The BCP 47 locale used by the relative time formatter.
 * @param  {string}  options.timeZone
 *     The timezone used when anchoring plain dates and date-times.
 * @param  {string}  options.inputFormat
 *     The Day.js-style token format used when parsing non-ISO strings.
 * @returns  {string|null}
 *     The relative date text, or null for an invalid date.
 *
 * @example
 * formatRelativeDate("2026-06-22T09:59:00", "2026-06-22T10:00:00");
 * // "1 minute ago"
 */
export function formatRelativeDate(value, relativeTo = Date.now(), options = {}) {
	// The signed amount and unit, or null when either date is invalid.
	const relativeDateParts = getRelativeDateParts(value, relativeTo, options);

	if (relativeDateParts === null) {
		return null;
	}

	// The locale that decides the wording of the relative date.
	const { locale } = resolveDateHelperOptions(options);
	// The signed amount and unit to pass to the formatter.
	const { unit, value: relativeValue } = relativeDateParts;

	return getRelativeTimeFormatter(locale).format(relativeValue, unit);
}

/**
 * Return the shared relative time formatter for a locale, building it on first
 * use.
 *
 * @param  {string}  locale
 *     The locale used by the formatter.
 *
 * @returns  {Intl.RelativeTimeFormat}
 *     The formatter shared by matching locales.
 */
function getRelativeTimeFormatter(locale) {
	if (!relativeTimeFormatters.has(locale)) {
		relativeTimeFormatters.set(locale, new Intl.RelativeTimeFormat(locale, { numeric: "auto" }));
	}

	return relativeTimeFormatters.get(locale);
}
