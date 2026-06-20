import { unref } from "vue";
import { isFunction } from "../general/is-function";
import { isObject } from "../object/is-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper callComponentMethod
 * @category Vue
 * @signature callComponentMethod(component, method: string, ...parameters: any)
 * @description
 * If the given `component` is an object and contains a function parameter `method`, call that method with any additional `parameters` and return its result. This helper allows safe calling of a method when an object might not exist.
 *
 * @example
 * // component = { method: () => "result" }
 * callComponentMethod(component, "method", "parameterOne"); // result
 * callComponentMethod(component, "undefinedMethod"); // undefined
 * callComponentMethod(null); // undefined
 */
export function callComponentMethod(component, method, ...params) {
	// Run unref, in case a Vue component reference is provided.
	const internalComponent = unref(component);

	if (!isObject(internalComponent)) {
		return;
	}

	const methodToRun = internalComponent[method];

	if (!isNonEmptyString(method) || !isFunction(methodToRun)) {
		return;
	}

	return methodToRun(...params);
}
