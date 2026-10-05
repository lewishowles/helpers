import { getSearchParameter } from "./get-search-parameter";

/**
 * @helper getCurrentUrlParameter
 * @category URL
 * @signature getCurrentUrlParameter(parameter: string)
 * @description
 * Retrieve `parameter` from the current browser URL, returning `null` if the
 * parameter is not present.
 *
 * @param  {string}  parameter
 *     The search parameter to retrieve.
 *
 * @returns  {string | null}
 *     The parameter value, or null when it is absent.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * getCurrentUrlParameter("page"); // 2
 * // https://duckduckgo.com?page=2
 * getCurrentUrlParameter("unknown"); // null
 */
export function getCurrentUrlParameter(parameter) {
	return getSearchParameter(window.location.search, parameter);
}
