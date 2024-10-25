/**
 * Determine whether the given variable is a string and has a non-zero length.
 *
 * isNonEmptyObject("string"); // true
 * isNonEmptyObject(""); // false
 * isNonEmptyObject(["A", "B"]); // false
 * isNonEmptyObject([" "]); // true
 * isNonEmptyObject([" "], { trim: true }); // false
 *
 * @param  {unknown}  variable
 *     The variable to test.
 * @param  {boolean}  options.trim
 *     Whether to trim the string of whitespace before testing its length.
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
