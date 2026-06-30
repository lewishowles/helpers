import { isFunction } from "./is-function";
import { isNumber } from "../number/is-number";
import { isObject } from "../object/is-object";

/**
 * @helper throttle
 * @category General
 * @signature throttle(fn: function, delay?: number, options?: object)
 * @description
 * Returns a throttled version of `fn` that runs at most once per `delay`
 * milliseconds.
 *
 * @note
 * By default `fn` runs immediately on the first call, then once more at the end
 * of the window if further calls arrived during it, using the latest arguments
 * and `this`. Set `options.leading: false` to skip the immediate run, or
 * `options.trailing: false` to skip the closing one; with both `false` it never
 * runs.
 *
 * The returned function exposes `.cancel()` to discard a pending run and
 * `.flush()` to run it immediately and return its result. A non-function `fn`
 * returns a safe no-op, and an invalid `delay` is treated as `0`.
 *
 * @example
 * window.addEventListener("scroll", throttle(onScroll, 100));
 *
 * @example
 * const save = throttle(saveForm, 500, { leading: false });
 */
export function throttle(fn, delay, options) {
	// Normalise input
	const resolvedOptions = isObject(options) ? options : {};
	const leading = resolvedOptions.leading !== false;
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

	let lastCallTime = 0;
	let timer = null;
	let lastArgs = null;
	let lastThis = null;
	let result = undefined;

	// Run fn with the latest call's args/this, stamp when it ran so the next
	// window is measured from here, and clear the pending call.
	function invoke() {
		result = fn.apply(lastThis, lastArgs);
		lastCallTime = Date.now();
		lastArgs = null;
		lastThis = null;
	}

	function throttled() {
		const now = Date.now();
		const elapsed = now - lastCallTime;

		// Always remember the latest call, in case a trailing run is needed.
		lastArgs = arguments;
		lastThis = this;

		if (elapsed >= resolvedDelay) {
			// The window has elapsed, so open a fresh one. Fire on the leading
			// edge, or just stamp the start time when leading is off.
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}

			if (leading) {
				invoke();
			} else {
				lastCallTime = now;
			}

			// Schedule a trailing run to catch any calls made before the window
			// closes. It only fires if a later call records fresh args.
			if (trailing) {
				timer = setTimeout(function () {
					timer = null;

					if (lastArgs) {
						invoke();
					}
				}, resolvedDelay);
			}
		} else if (trailing) {
			// Still inside the window, so (re)schedule the trailing run for when
			// it closes, using whatever the latest call turns out to be.
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(function () {
				timer = null;
				invoke();
			}, resolvedDelay - elapsed);
		}

		return result;
	}

	throttled.cancel = function () {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		lastArgs = null;
		lastThis = null;
		lastCallTime = 0;
	};

	throttled.flush = function () {
		if (!timer || !lastArgs) {
			return undefined;
		}

		clearTimeout(timer);
		timer = null;

		invoke();

		return result;
	};

	return throttled;
}
