import { getRelativeDateParts } from "./get-relative-date-parts";
import { resolveDateHelperOptions } from "./configure-date-helpers";

/**
 * Format a supported date value relative to another date.
 *
 * @helper formatRelativeDate
 * @category Date
 * @signature formatRelativeDate(value: any, relativeTo?: any, options?: object)
 * @description
 * Format a supported date input as a relative date string, such as
 * `3 minutes ago` or `in 2 days`.
 *
 * @example
 * formatRelativeDate("2026-06-22T09:59:00", "2026-06-22T10:00:00");
 * // "1 minute ago"
 */
export function formatRelativeDate(value, relativeTo = Date.now(), options = {}) {
	const relativeDateParts = getRelativeDateParts(value, relativeTo, options);

	if (relativeDateParts === null) {
		return null;
	}

	const { locale } = resolveDateHelperOptions(options);
	const { unit, value: relativeValue } = relativeDateParts;

	return new Intl.RelativeTimeFormat(locale, {
		numeric: "auto",
	}).format(relativeValue, unit);
}
