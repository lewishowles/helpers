import { isFunction } from "./is-function";
import { isNumber } from "../number/is-number";
import { isObject } from "../object/is-object";

/**
 * @helper debounce
 * @category General
 * @signature debounce(fn: function, delay?: number, options?: object)
 * @description
 * Returns a debounced version of `fn` that waits until `delay` milliseconds
 * have passed without another call before running.
 *
 * @note
 * By default `fn` runs on the trailing edge, after calls stop, using the most
 * recent call's arguments and `this`. Set `options.leading` to also run on the
 * first call, or `options.trailing: false` to skip the trailing run; with both
 * `false` it never runs.
 *
 * The returned function exposes `.cancel()` to discard a pending run and
 * `.flush()` to run it immediately and return its result. A non-function `fn`
 * returns a safe no-op, and an invalid `delay` is treated as `0`.
 *
 * @example
 * const search = debounce(runSearch, 300);
 *
 * @example
 * const save = debounce(saveForm, 1000, { leading: true });
 */
export function debounce(fn, delay, options) {
	// Normalise input
	const resolvedOptions = isObject(options) ? options : {};
	const leading = resolvedOptions.leading === true;
	const trailing = resolvedOptions.trailing !== false;
	const resolvedDelay = isNumber(delay) && delay >= 0 ? delay : 0;

	// If there's nothing to run (fn isn't a function, or both edges are off),
	// return a safe function with the correct structure.
	if (!isFunction(fn) || (!leading && !trailing)) {
		const noop = function () {};

		noop.cancel = function () {};
		noop.flush = function () {
			return undefined;
		};

		return noop;
	}

	let timer = null;
	let lastArgs = null;
	let lastThis = null;
	let result = undefined;

	function debounced() {
		const callThis = this;
		const callArgs = arguments;

		// Fire on the leading edge only when a window isn't already open.
		const callNow = !timer && leading;

		if (callNow) {
			// Don't record args here, so a lone leading+trailing call doesn't
			// also fire on the trailing edge.
			result = fn.apply(callThis, callArgs);
		} else if (trailing) {
			// Remember the latest call for the trailing run.
			lastArgs = callArgs;
			lastThis = callThis;
		}

		// (Re)start the window. Any pending trailing run fires once it elapses.
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(function () {
			timer = null;

			if (trailing && lastArgs) {
				result = fn.apply(lastThis, lastArgs);
				lastArgs = null;
				lastThis = null;
			}
		}, resolvedDelay);

		return result;
	}

	debounced.cancel = function () {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		lastArgs = null;
		lastThis = null;
	};

	debounced.flush = function () {
		if (!timer || !lastArgs) {
			return undefined;
		}

		clearTimeout(timer);

		timer = null;

		result = fn.apply(lastThis, lastArgs);

		lastArgs = null;
		lastThis = null;

		return result;
	};

	return debounced;
}
