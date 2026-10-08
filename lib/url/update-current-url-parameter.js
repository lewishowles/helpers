import { isNonEmptyString } from "#string/is-non-empty-string";
import { updateSearchParameter } from "./update-search-parameter";

/**
 * @helper updateCurrentUrlParameter
 * @category URL
 * @signature updateCurrentUrlParameter(parameter: string, value: string | null)
 * @description
 * Set `parameter` to `value` in the current browser URL, or remove it when
 * `value` is `null`. This reads `window.location` and uses `replaceState`, so
 * it only runs in a browser or a browser-like test environment, and it does not
 * add a history entry. Use `updateSearchParameter` with a supplied search
 * string on the server or for another URL.
 *
 * @param  {string}  parameter
 *     The search parameter to update.
 * @param  {string | null}  value
 *     The value to set, or `null` to remove the parameter.
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

	// A copy of the current browser URL to update.
	const url = new URL(window.location.href);

	url.search = updateSearchParameter(url.search, parameter, value);

	window.history.replaceState(window.history.state, "", url);
}
