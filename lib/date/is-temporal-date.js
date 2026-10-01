// Standard string tags for the supported Temporal date types.
const temporalDateTags = {
	Instant: "[object Temporal.Instant]",
	PlainDate: "[object Temporal.PlainDate]",
	PlainDateTime: "[object Temporal.PlainDateTime]",
	ZonedDateTime: "[object Temporal.ZonedDateTime]",
};

/**
 * Check whether a value is a supported Temporal date type.
 *
 * @helper isTemporalDate
 * @category Date
 * @signature isTemporalDate(value: any, type?: string)
 * @description
 *     Check whether a value is a Temporal `Instant`, `PlainDate`,
 *     `PlainDateTime`, or `ZonedDateTime`. An optional type restricts the check
 *     to one supported Temporal type.
 *
 * @param  {any}  value
 *     The value to inspect.
 * @param  {string}  type
 *     The optional Temporal type name to match.
 * @returns  {boolean}
 *     Whether the value has a supported Temporal date tag.
 *
 * @note
 *     Recognition uses Temporal's standard string tags, so values from another
 *     compatible Temporal implementation or module copy are supported. This is
 *     a type check for genuine Temporal values, not validation of untrusted
 *     objects that deliberately imitate those tags.
 *
 * @example
 * isTemporalDate(Temporal.PlainDate.from("2026-06-22")); // true
 * isTemporalDate(value, "PlainDate");
 */
export function isTemporalDate(value, type) {
	try {
		// The value's standard tag, such as `[object Temporal.PlainDate]`,
		// which matches even when the value comes from another copy of
		// Temporal.
		const valueTag = Object.prototype.toString.call(value);

		if (type !== undefined) {
			return temporalDateTags[type] === valueTag;
		}

		return Object.values(temporalDateTags).includes(valueTag);
	} catch {
		return false;
	}
}
