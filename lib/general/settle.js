/**
 * Settle every promise and report the successful values and errors.
 *
 * @helper settle
 * @category General
 * @signature settle(promises: any[])
 * @description
 * Awaits an array of promises (or plain values) and reports every outcome,
 * mirroring `Promise.allSettled`. Returns a positional `results` array
 * alongside convenience `values` and `errors` arrays for common bulk-action
 * patterns.
 *
 * @param  {any[]}  promises
 *     The promises or values to settle.
 *
 * @returns  {Promise<object>}
 *     The `results` for every item in order, plus the fulfilled `values` and
 *     rejected `errors`.
 *
 * @note
 * Non-thenable values are treated as fulfilled and returned as-is — functions
 * are never invoked. To run functions, call them first:
 * `settle(items.map(item => action(item)))`.
 *
 * The `results` array includes every item in order, and each entry carries its
 * original `index`, so a failure can be mapped straight back to its input —
 * useful for bulk operations where you need to know exactly which calls failed.
 * `values` and `errors` exclude the other outcome's gaps, for the common
 * "everything that worked / failed" patterns.
 *
 * @example
 * const { results } = await settle(ids.map(id => api.delete(id)));
 * const failedIds = results.filter(result => result.status === "rejected").map(result => ids[result.index]);
 *
 * @example
 * const { values, errors, results } = await settle([Promise.resolve(1), Promise.reject("nope")]);
 * // values: [1]
 * // errors: ["nope"]
 * // results: [
 * //   { status: "fulfilled", value: 1, index: 0 },
 * //   { status: "rejected", reason: "nope", index: 1 },
 * // ]
 *
 * @example
 * const action = () => "called";
 * const { values } = await settle([7, action]); // values: [7, action]; action was not called
 * await settle([]); // { values: [], errors: [], results: [] }
 * await settle(null); // { values: [], errors: [], results: [] }
 */
export async function settle(promises) {
	if (!Array.isArray(promises)) {
		return { values: [], errors: [], results: [] };
	}

	// Wait for every promise to settle.
	const settled = await Promise.allSettled(promises);
	// Collect the fulfilled promise values.
	const values = [];
	// Collect the rejected promise reasons.
	const errors = [];
	// Keep each promise outcome in its original position.
	const results = [];

	settled.forEach((result, index) => {
		if (result.status === "fulfilled") {
			values.push(result.value);
			results.push({ status: "fulfilled", value: result.value, index });
		} else {
			errors.push(result.reason);
			results.push({ status: "rejected", reason: result.reason, index });
		}
	});

	return { values, errors, results };
}
