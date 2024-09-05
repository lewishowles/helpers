import { chartColours } from "./chart-colours";
import { getNextIndex, isNonEmptyArray } from "@array";

/**
 * For a given slice index, retrieve the appropriate chart colour. Colours are
 * retrieved from a default set, or a set of colours can be provided.
 *
 * @param  {number}  index
 *     The index of the chart slice.
 *
 * @param  {array}  overrideColours
 *     Colours to select from, overriding the default set.
 */
export function getNextColour(index, overrideColours) {
	const coloursToUse = isNonEmptyArray(overrideColours) ? overrideColours : chartColours;

	return coloursToUse[getNextIndex(index - 1, coloursToUse, { wrap: true })];
}
