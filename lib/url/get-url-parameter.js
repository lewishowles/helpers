import { getSearchParameter } from "./get-search-parameter";

/**
 * @helper getUrlParameter
 * @category URL
 * @signature getUrlParameter(parameter: string)
 * @description
 * Retrieve `parameter` from the current browser URL, returning `null` if the parameter is not present.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * getUrlParameter("page"); // 2
 * // https://duckduckgo.com?page=2
 * getUrlParameter("unknown"); // null
 */
export function getUrlParameter(parameter) {
	return getSearchParameter(window.location.search, parameter);
}
