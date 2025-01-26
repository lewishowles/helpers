import { isNonEmptyString } from "@string";

/**
 * Update the value of a URL parameter. If the parameter doesn't exist, it is
 * added. If the value is null, it is removed.
 *
 * @param  {string}  parameter
 *     The name of the parameter to update.
 * @param  {string|null}  value
 *     The value of the parameter.
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
