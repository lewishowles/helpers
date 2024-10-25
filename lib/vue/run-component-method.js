import { isFunction } from "@general";
import { isObject } from "@object";
import { isNonEmptyString } from "@string";

/**
 * Run a method on a component, if that method exists.
 *
 * @param  {object}  component
 *     The component on which to run a method.
 * @param  {string}  method
 *     The method to run,
 * @param  {unknown}  params
 *     Any additional parameters to pass to the method
 */
export function runComponentMethod(component, method, ...params) {
	if (!isObject(component)) {
		return;
	}

	const methodToRun = component?.[method];

	if (!isNonEmptyString(method) || !isFunction(methodToRun)) {
		return;
	}

	component[method](...params);

	return true;
}
