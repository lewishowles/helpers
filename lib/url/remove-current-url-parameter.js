import { updateCurrentUrlParameter } from "./update-current-url-parameter";

/**
 * @helper removeCurrentUrlParameter
 * @category URL
 * @signature removeCurrentUrlParameter(parameter: string)
 * @description
 * Remove `parameter` from the current browser URL if it exists. This reads
 * `window.location` and uses `replaceState`, so it only runs in a browser or a
 * browser-like test environment, and it does not add a history entry. Use
 * `removeSearchParameter` with a supplied search string on the server or for
 * another URL.
 *
 * @param  {string}  parameter
 *     The search parameter to remove.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * removeCurrentUrlParameter("unknown"); // https://duckduckgo.com?page=2
 * // https://duckduckgo.com?page=2
 * removeCurrentUrlParameter("page"); // https://duckduckgo.com
 */
export function removeCurrentUrlParameter(parameter) {
	updateCurrentUrlParameter(parameter, null);
}
