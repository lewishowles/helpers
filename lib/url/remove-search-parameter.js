import { updateSearchParameter } from "./update-search-parameter";

/**
 * @helper removeSearchParameter
 * @category URL
 * @signature removeSearchParameter(search: string | URLSearchParams, parameter: string)
 * @description
 * Return a search string with `parameter` removed.
 *
 * @param  {string | URLSearchParams}  search
 *     The search string or URL search parameters to update.
 * @param  {string}  parameter
 *     The search parameter to remove.
 *
 * @returns  {string}
 *     The search string without the selected parameter.
 *
 * @example
 * removeSearchParameter("?page=2", "unknown"); // ?page=2
 * removeSearchParameter("?page=2", "page"); // ""
 */
export function removeSearchParameter(search, parameter) {
	return updateSearchParameter(search, parameter, null);
}
