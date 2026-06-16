/**
 * @helper isNonEmptyString
 * @category String
 * @signature isNonEmptyString(variable: any, { trim: boolean = false })
 * @description
 * Determines whether the given `variable` is both a string and has at least one character. If `trim` is true, the string is trimmed of whitespace before the test is performed.
 *
 * @example
 * isNonEmptyString("string"); // true
 * isNonEmptyString(""); // false
 * isNonEmptyString(["A", "B"]); // false
 * isNonEmptyString("  "); // true
 * isNonEmptyString("  ", { trim: true }); // false
 */
export function isNonEmptyString(variable, { trim = false } = {}) {
	if (typeof variable !== "string") {
		return false;
	}

	if (trim === true) {
		return variable.trim().length > 0;
	}

	return variable.length > 0;
}
