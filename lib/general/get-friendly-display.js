/**
 * Display the type of the given variable in a human-friendly way.
 *
 * getFriendlyDisplay(['A', 'B', 'C', 'D']); // <array[4]>
 * getFriendlyDisplay([]); // <array[0]>
 * getFriendlyDisplay("hello"); // hello <string>
 *
 * @param  {unknown}  variable
 *     The variable to display.
 */
export function getFriendlyDisplay(variable) {
	if (variable === null) {
		return "<null>";
	}

	if (variable === undefined) {
		return "<undefined>";
	}

	if (typeof variable === "string") {
		return [variable, `<string[${variable.length}]>`].filter(piece => piece).join(" ");
	}

	if (Array.isArray(variable)) {
		return `<array[${variable.length}]>`;
	}

	if (typeof variable === "object") {
		return `<object[${Object.keys(variable).length}]>`;
	}

	if (isNaN(variable)) {
		return "<NaN>";
	}

	if (variable === Infinity || variable === -Infinity) {
		return "<infinity>";
	}

	if (typeof variable === "number" && Number.isFinite(variable)) {
		return "<number>";
	}
}
