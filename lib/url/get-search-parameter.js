import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper getSearchParameter
 * @category URL
 * @signature getSearchParameter(search: string | URLSearchParams, parameter: string)
 * @description
 * Retrieve `parameter` from a URL search string or `URLSearchParams` instance, returning `null` when the parameter is not present.
 *
 * @example
 * getSearchParameter("?page=2", "page"); // 2
 * getSearchParameter("?page=2", "unknown"); // null
 */
export function getSearchParameter(search, parameter) {
	if (!isNonEmptyString(parameter)) {
		return null;
	}

	const searchParams = new URLSearchParams(search);

	return searchParams.get(parameter);
}
