import { isNonEmptyString } from "../string/is-non-empty-string";
import { updateSearchParameter } from "./update-search-parameter";

/**
 * @helper updateCurrentUrlParameter
 * @category URL
 * @signature updateCurrentUrlParameter(parameter: string, value: string | null)
 * @description
 * Update the current browser URL to set `parameter` to `value`, adding `parameter` if it doesn't already exist, or overwriting any current value if it doesn't. If `value` is `null`, the parameter is removed.
 *
 * @example
 * // https://duckduckgo.com
 * updateCurrentUrlParameter("page", "2"); // https://duckduckgo.com?page=2
 * // https://duckduckgo.com?page=2
 * updateCurrentUrlParameter("page", "3"); // https://duckduckgo.com?page=3
 * // https://duckduckgo.com?page=3
 * updateCurrentUrlParameter("page", null); // https://duckduckgo.com
 */
export function updateCurrentUrlParameter(parameter, value) {
	if (!isNonEmptyString(parameter)) {
		return;
	}

	const url = new URL(window.location.href);

	url.search = updateSearchParameter(url.search, parameter, value);

	window.history.replaceState(window.history.state, "", url);
}
