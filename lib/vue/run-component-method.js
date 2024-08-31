import { isFunction } from "@general";
import { isNonEmptyObject } from "@object";
import { isNonEmptyString } from "@string";

/**
 * Run a method on a component, if that method exists.
 *
 * @param  {object}  component
 *     The component on which to run a method.
 * @param  {string}  method
 *     The method to run,
 * @param  {mixed}  params
 *     Any additional parameters to pass to the method
 */
export function runComponentMethod(component, method, ...params) {
	if (!isNonEmptyObject(component)) {
		return;
	}

	if (!isNonEmptyString(method) || !isFunction(component[method])) {
		return;
	}

	component[method](...params);

	return true;
}
