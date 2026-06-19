import { updateSearchParameter } from "./update-search-parameter";

/**
 * @helper removeSearchParameter
 * @category URL
 * @signature removeSearchParameter(search: string | URLSearchParams, parameter: string)
 * @description
 * Return a search string with `parameter` removed.
 *
 * @example
 * removeSearchParameter("?page=2", "unknown"); // ?page=2
 * removeSearchParameter("?page=2", "page"); // ""
 */
export function removeSearchParameter(search, parameter) {
	return updateSearchParameter(search, parameter, null);
}
