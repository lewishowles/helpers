/**
 * Split a string into word tokens by detecting boundaries between case changes,
 * digit/letter transitions, and existing separators.
 *
 * Existing separators (`-`, `_`, whitespace) are consumed and start a new
 * token. A lowercase letter followed by an uppercase letter starts a new token
 * (camelCase → camel | Case). A digit followed by an uppercase letter starts a
 * new token (item2Name → item2 | Name). An uppercase run followed by an
 * uppercase-then-lowercase sequence splits before the last uppercase (APIKey →
 * API | Key).
 *
 * @param  {string}  string
 *     The string to tokenise.
 *
 * @returns  {string[]}
 *     The word tokens, preserving their original case.
 */
export function tokeniseWords(string) {
	// Replace existing separators with spaces.
	let normalised = string.replace(/[-_\s]+/g, " ");

	// Split lowercase → uppercase transition.
	normalised = normalised.replace(/([a-z])([A-Z])/g, "$1 $2");

	// Split digit → uppercase transition.
	normalised = normalised.replace(/(\d)([A-Z])/g, "$1 $2");

	// Split acronym run before the last uppercase that starts a new word.
	normalised = normalised.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

	return normalised.trim().split(" ").filter(Boolean);
}
