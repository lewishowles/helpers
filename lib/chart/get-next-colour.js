import { chartColours } from "./chart-colours";
import { getNextIndex } from "@array";

/**
 * For a given slice index, retrieve the appropriate chart colour.
 *
 * @param  {number}  index
 *     The index of the chart slice.
 */
export function getNextColour(index) {
	return chartColours[getNextIndex(index - 1, chartColours, { wrap: true })];
}
