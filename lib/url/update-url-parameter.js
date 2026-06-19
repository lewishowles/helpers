import { isNonEmptyString } from "../string/is-non-empty-string";
import { updateSearchParameter } from "./update-search-parameter";

/**
 * @helper updateUrlParameter
 * @category URL
 * @signature updateUrlParameter(parameter: string, value: string | null)
 * @description
 * Update the current browser URL to set `parameter` to `value`, adding `parameter` if it doesn't already exist, or overwriting any current value if it doesn't. If `value` is `null`, the parameter is removed.
 *
 * @example
 * // https://duckduckgo.com
 * updateUrlParameter("page", "2"); // https://duckduckgo.com?page=2
 * // https://duckduckgo.com?page=2
 * updateUrlParameter("page", "3"); // https://duckduckgo.com?page=3
 * // https://duckduckgo.com?page=3
 * updateUrlParameter("page", null); // https://duckduckgo.com
 */
export function updateUrlParameter(parameter, value) {
	if (!isNonEmptyString(parameter)) {
		return;
	}

	const url = new URL(window.location.href);

	url.search = updateSearchParameter(url.search, parameter, value);

	window.history.replaceState(null, "", url);
}
