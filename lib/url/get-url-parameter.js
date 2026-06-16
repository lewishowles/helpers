import { isNonEmptyString } from "@string";

/**
 * @helper getUrlParameter
 * @category URL
 * @signature getUrlParameter(parameter: string)
 * @description
 * Retrieve the current value of `parameter`, returning `null` if the parameter is not present.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * getUrlParameter("page"); // 2
 * // https://duckduckgo.com?page=2
 * getUrlParameter("unknown"); // null
 */
export function getUrlParameter(parameter) {
	if (!isNonEmptyString(parameter)) {
		return null;
	}

	const urlParams = new URLSearchParams(window.location.search);

	return urlParams.get(parameter);
}
