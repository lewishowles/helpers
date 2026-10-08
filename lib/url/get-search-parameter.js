import { isNonEmptyString } from "#string/is-non-empty-string";

/**
 * @helper getSearchParameter
 * @category URL
 * @signature getSearchParameter(search: string | URLSearchParams, parameter: string)
 * @description
 * Retrieve `parameter` from a URL search string or `URLSearchParams` instance,
 * returning `null` when the parameter is not present.
 *
 * @param  {string | URLSearchParams}  search
 *     The search string or URL search parameters to read from.
 * @param  {string}  parameter
 *     The search parameter to retrieve.
 *
 * @returns  {string | null}
 *     The parameter value, or null when it is absent.
 *
 * @example
 * getSearchParameter("?page=2", "page"); // "2"
 * getSearchParameter("?page=2", "unknown"); // null
 */
export function getSearchParameter(search, parameter) {
	if (!isNonEmptyString(parameter)) {
		return null;
	}

	// The parsed search parameters.
	const searchParams = new URLSearchParams(search);

	return searchParams.get(parameter);
}
