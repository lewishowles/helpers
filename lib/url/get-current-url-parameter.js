import { getSearchParameter } from "./get-search-parameter";

/**
 * @helper getCurrentUrlParameter
 * @category URL
 * @signature getCurrentUrlParameter(parameter: string)
 * @description
 * Read `parameter` from `window.location.search`, returning `null` when it is
 * absent. This needs `window`, so it only runs in a browser or a browser-like
 * test environment. Use `getSearchParameter` with a supplied search string on
 * the server or for another URL.
 *
 * @param  {string}  parameter
 *     The search parameter to retrieve.
 *
 * @returns  {string | null}
 *     The parameter value, or null when it is absent.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * getCurrentUrlParameter("page"); // "2"
 * // https://duckduckgo.com?page=2
 * getCurrentUrlParameter("unknown"); // null
 */
export function getCurrentUrlParameter(parameter) {
	return getSearchParameter(window.location.search, parameter);
}
