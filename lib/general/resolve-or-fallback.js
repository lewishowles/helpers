import { isFunction } from "./is-function";

/**
 * Determine whether a value is thenable (promise-like).
 *
 * @param  {any}  value
 *     The value to test.
 * @return  {boolean}
 *     True if the value exposes a `then` method.
 */
function isThenable(value) {
	return Boolean(value) && isFunction(value.then);
}

/**
 * @helper resolveOrFallback
 * @category General
 * @signature resolveOrFallback(promise: any, fallback: any | (() => any))
 * @description
 * Resolves `promise`, returning its value, or `fallback` if it rejects. Always
 * returns a promise, even for synchronous inputs, for a consistent shape.
 *
 * @note
 * This is async/value recovery, not validation — see `validateOrFallback` for
 * keyword-based value checks.
 *
 * If `fallback` is a function it is called lazily, only on rejection, and its
 * return value is used. A throwing fallback function propagates. Non-thenable
 * inputs resolve as-is, except `null` / `undefined`, which resolve to the
 * fallback.
 *
 * @example
 * await resolveOrFallback(api.getSettings(), defaultSettings);
 * await resolveOrFallback(fetchRemote(), () => getCached());
 */
export async function resolveOrFallback(promise, fallback) {
	const resolveFallback = () => (isFunction(fallback) ? fallback() : fallback);

	if (promise === null || promise === undefined) {
		return resolveFallback();
	}

	if (!isThenable(promise)) {
		return promise;
	}

	try {
		return await promise;
	} catch {
		return resolveFallback();
	}
}
