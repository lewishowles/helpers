import { getSearchParameter } from "./get-search-parameter";

/**
 * @helper getCurrentUrlParameter
 * @category URL
 * @signature getCurrentUrlParameter(parameter: string)
 * @description
 * Retrieve `parameter` from the current browser URL, returning `null` if the parameter is not present.
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
