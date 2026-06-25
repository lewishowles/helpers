import { isNonEmptyObject } from "../object/is-non-empty-object";
import { deepCopy } from "../object/deep-copy";
import { deepMerge } from "../object/deep-merge";

// The built-in date defaults used until a project configures its own.
const defaultDateHelpersConfig = {
	locale: "en-GB",
	timeZone: "Europe/London",
	inputFormat: "DD/MM/YYYY",
	defaultFormat: "date",
	formats: {
		date: { dateStyle: "medium" },
		dateTime: { dateStyle: "medium", timeStyle: "short" },
		shortDate: "DD/MM/YYYY",
	},
};

// The active date helper configuration.
let dateHelpersConfig = deepCopy(defaultDateHelpersConfig);

/**
 * Configure global defaults used by date helpers.
 *
 * @helper configureDateHelpers
 * @category Date
 * @signature configureDateHelpers(config?: object)
 * @description
 * Set project-wide defaults for date parsing and formatting.
 *
 * @note
 * Calling this helper with no arguments returns the current configuration.
 *
 * Projects can override these defaults per helper call. The default locale is
 * `en-GB`, the default timezone is `Europe/London`, and token formats use
 * Day.js-style tokens such as `DD/MM/YYYY`.
 *
 * The `formats` option is a map of named output formats. Each key is a name
 * that can be passed to `formatDate` as the format argument, and each value is
 * either a Day.js-style token string (e.g. `"DD/MM/YYYY"`) or an
 * `Intl.DateTimeFormatOptions` object (e.g. `{ dateStyle: "medium" }`). The
 * built-in named formats are `date`, `dateTime`, and `shortDate`. Projects can
 * override these or add their own — `formatDate` resolves the key at call time.
 * The `defaultFormat` option determines which named format is used when
 * `formatDate` is called with no format argument.
 *
 * @example
 * configureDateHelpers({
 *     locale: "en-US",
 *     timeZone: "America/New_York",
 *     inputFormat: "MM/DD/YYYY",
 *     formats: {
 *         shortDate: "MM/DD/YYYY",
 *         fullDate: { year: "numeric", month: "long", day: "2-digit" },
 *     },
 *     defaultFormat: "fullDate",
 * });
 *
 * @example
 * // formatDate("22/06/2026") uses defaultFormat → "fullDate"
 * // formatDate("22/06/2026", "shortDate") uses the named format → "06/22/2026"
 */
export function configureDateHelpers(config) {
	if (!isNonEmptyObject(config)) {
		return getDateHelpersConfig();
	}

	dateHelpersConfig = deepMerge(dateHelpersConfig, config);

	return getDateHelpersConfig();
}

/**
 * Reset date helper defaults.
 */
export function resetDateHelpersConfig() {
	dateHelpersConfig = deepCopy(defaultDateHelpersConfig);

	return getDateHelpersConfig();
}

/**
 * Get a defensive copy of the active date helper configuration.
 */
export function getDateHelpersConfig() {
	return deepCopy(dateHelpersConfig);
}

/**
 * Resolve per-call date helper options against the active configuration.
 *
 * @param  {object}  options
 *     The helper-specific options to apply.
 */
export function resolveDateHelperOptions(options = {}) {
	if (!isNonEmptyObject(options)) {
		return getDateHelpersConfig();
	}

	return deepMerge(dateHelpersConfig, options);
}
