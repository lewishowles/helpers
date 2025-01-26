import { isNonEmptyString } from "@string";

/**
 * Get the current value of the given URL parameter. Returns null if the given
 * parameter is not present.
 *
 * @param  {string}  parameter
 *     The name of the parameter to get.
 */
export function getUrlParameter(parameter) {
	if (!isNonEmptyString(parameter)) {
		return null;
	}

	const urlParams = new URLSearchParams(window.location.search);

	return urlParams.get(parameter);
}
