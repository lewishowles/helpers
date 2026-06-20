import { updateCurrentUrlParameter } from "./update-current-url-parameter";

/**
 * @helper removeCurrentUrlParameter
 * @category URL
 * @signature removeCurrentUrlParameter(parameter: string)
 * @description
 * Remove `parameter` from the current browser URL if it exists.
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
