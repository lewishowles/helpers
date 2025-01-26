import { updateUrlParameter } from "./update-url-parameter";

/**
 * Remove the given URL parameter, if it exists.
 *
 * @param  {string}  parameter
 *     The name of the parameter to update.
 */
export function removeUrlParameter(parameter) {
	updateUrlParameter(parameter, null);
}
