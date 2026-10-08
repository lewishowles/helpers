/**
 * @helper isDefined
 * @category General
 * @signature isDefined(value: any)
 * @description
 * Determines whether the given `value` is neither `null` nor `undefined`.
 * Unlike a falsy check, this guard treats `0`, `""`, and `false` as defined
 * values. Pass it to `array.filter` or `array.find` to skip both `null` and
 * `undefined`; `firstDefined` and `lastDefined` skip only `undefined`.
 *
 * @param  {any}  value
 *     The value to check.
 *
 * @returns  {boolean}
 *     Whether the value is defined.
 *
 * @example
 * isDefined("hello"); // true
 * isDefined(0); // true
 * isDefined(null); // false
 * isDefined(undefined); // false
 */
export function isDefined(value) {
	return value !== null && value !== undefined;
}
