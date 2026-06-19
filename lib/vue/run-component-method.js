import { unref } from "vue";
import { isFunction } from "../general/is-function";
import { isObject } from "../object/is-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper runComponentMethod
 * @category Vue
 * @signature runComponentMethod(component, method: string, ...parameters: any)
 * @description
 * If the given `component` is an object and contains a function parameter `method`, call that method with any additional `parameters`. This helper allows safe running of a method when an object might not exist.
 *
 * @example
 * // component = { method: () => {} }
 * runComponentMethod(component, "method", "parameterOne"); // true
 * runComponentMethod(component, "undefinedMethod"); // undefined
 * runComponentMethod(null); // undefined
 */
export function runComponentMethod(component, method, ...params) {
	// Run unref, in case a Vue component reference is provided.
	const internalComponent = unref(component);

	if (!isObject(internalComponent)) {
		return;
	}

	const methodToRun = internalComponent[method];

	if (!isNonEmptyString(method) || !isFunction(methodToRun)) {
		return;
	}

	internalComponent[method](...params);

	return true;
}
