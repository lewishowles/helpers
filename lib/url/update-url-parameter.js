import { isNonEmptyString } from "@string";

/**
 * @helper updateUrlParameter
 * @category URL
 * @signature updateUrlParameter(parameter: string, value: string)
 * @description
 * Update the current URL to set `parameter` to `value`, adding `parameter` if it doesn't already exist, or overwriting any current value if it doesn't. If `value` is `null`, the parameter is removed.
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

	if (value === null) {
		url.searchParams.delete(parameter);
	} else {
		url.searchParams.set(parameter, value);
	}

	window.history.replaceState(null, "", url);
}
