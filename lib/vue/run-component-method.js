import { isFunction } from "@general";
import { isNonEmptyString } from "@string";
import { isObject } from "@object";
import { unref } from "vue";

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

	// Run unref, in case a Vue component reference is provided.
	const internalComponent = unref(component);

	const methodToRun = internalComponent?.[method];

	if (!isNonEmptyString(method) || !isFunction(methodToRun)) {
		return;
	}

	internalComponent[method](...params);

	return true;
}
