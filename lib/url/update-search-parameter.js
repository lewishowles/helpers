import { isNonEmptyString } from "#string/is-non-empty-string";

/**
 * @helper updateSearchParameter
 * @category URL
 * @signature updateSearchParameter(search: string | URLSearchParams, parameter: string, value: string | null)
 * @description
 *     Return a search string with `parameter` set to `value`. If `value` is
 *     `null`, the parameter is removed.
 *
 * @param  {string | URLSearchParams}  search
 *     The search string or URL search parameters to update.
 * @param  {string}  parameter
 *     The search parameter to update.
 * @param  {string | null}  value
 *     The value to set, or `null` to remove the parameter.
 *
 * @returns  {string}
 *     The updated search string.
 *
 * @example
 * updateSearchParameter("", "page", "2"); // ?page=2
 * updateSearchParameter("?page=2", "page", "3"); // ?page=3
 * updateSearchParameter("?page=3", "page", null); // ""
 */
export function updateSearchParameter(search, parameter, value) {
	if (!isNonEmptyString(parameter)) {
		return normaliseSearchString(search);
	}

	// The parsed search parameters to update.
	const searchParams = new URLSearchParams(search);

	if (value === null) {
		searchParams.delete(parameter);
	} else {
		searchParams.set(parameter, value);
	}

	return stringifySearchParams(searchParams);
}

/**
 * Return a normalised search string for invalid parameter updates.
 *
 * @param  {string | URLSearchParams}  search
 *     The search value to normalise.
 *
 * @returns  {string}
 *     The normalised search string.
 */
function normaliseSearchString(search) {
	return stringifySearchParams(new URLSearchParams(search));
}

/**
 * Return a search string with a leading `?`, or an empty string.
 *
 * @param  {URLSearchParams}  searchParams
 *     The search parameters to stringify.
 *
 * @returns  {string}
 *     The search string with a leading question mark, or an empty string.
 */
function stringifySearchParams(searchParams) {
	// The encoded search parameters without a leading question mark.
	const search = searchParams.toString();

	if (!isNonEmptyString(search)) {
		return "";
	}

	return `?${search}`;
}
