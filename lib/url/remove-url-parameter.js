import { updateUrlParameter } from "./update-url-parameter";

/**
 * @helper removeUrlParameter
 * @category URL
 * @signature removeUrlParameter(parameter: string)
 * @description
 * Remove `parameter` from the current URL if it exists.
 *
 * @example
 * // https://duckduckgo.com?page=2
 * removeUrlParameter("unknown"); // https://duckduckgo.com?page=2
 * // https://duckduckgo.com?page=2
 * removeUrlParameter("page"); // https://duckduckgo.com
 */
export function removeUrlParameter(parameter) {
	updateUrlParameter(parameter, null);
}
