import { isPlainObject } from "#object/is-plain-object";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { toNullableString } from "#string/to-nullable-string";

// Supported date-part keys for form date objects.
const datePartKeys = ["day", "month", "year"];

/**
 * Check whether a date-parts object has any filled part.
 *
 * @helper hasDateParts
 * @category Date
 * @signature hasDateParts(parts: object)
 * @description
 *     Determine whether a `{ day, month, year }` object has at least one
 *     non-empty part. Empty strings, whitespace-only strings, `null`, and
 *     `undefined` count as empty.
 *
 * @param  {object}  parts
 *     The date parts to inspect.
 * @returns  {boolean}
 *     Whether any supported date part is filled.
 *
 * @example
 * hasDateParts({ day: "1", month: "", year: "" }); // true
 * hasDateParts({ day: "", month: "", year: "" }); // false
 */
export function hasDateParts(parts) {
	if (!isPlainObject(parts)) {
		return false;
	}

	return datePartKeys.some((key) => isNonEmptyString(toNullableString(parts[key]), { trim: true }));
}
