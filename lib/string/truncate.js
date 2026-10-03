import { validateOrFallback } from "#general/validate-or-fallback";
import { isNumber } from "#number/is-number";
import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper truncate
 * @category String
 * @signature truncate(string: string, length: number = 10, { decoration: string = "…", preserveWords: boolean = false, strict: boolean = true, includeDecoration: boolean = true, position: "start" | "end" | "middle" = "end" })
 * @description
 *     Truncate a string to a given length, with various options for how the
 *     truncation occurs.
 *
 * @param  {string}  string
 *     The string to truncate.
 * @param  {number}  length
 *     The length to truncate the string to.
 * @param  {object}  [options]
 *     Settings for how the string is shortened.
 * @param  {string}  [options.decoration="…"]
 *     The marker shown where text is removed.
 * @param  {boolean}  [options.includeDecoration=true]
 *     Whether the marker counts towards the length.
 * @param  {boolean}  [options.preserveWords=false]
 *     Whether to keep words whole.
 * @param  {boolean}  [options.strict=true]
 *     When preserving words, whether to stay within the character budget.
 * @param  {"start" | "end" | "middle"}  [options.position="end"]
 *     Where to remove text and show the decoration.
 *
 * @returns  {string}
 *     The string, shortened when it is too long, or an empty string when the
 *     input is not a string.
 *
 * @note
 *     If the provided variable is not a string, returns an empty string.
 *
 * @example
 * truncate("Hello, world!"); // "Hello, wo…"
 * truncate("Hello, world!", 15); // "Hello, world!"
 * truncate("Hello, world!", 8); // "Hello, …"
 * truncate("Hello, world!", 8, { preserveWords: true }); // "Hello,…"
 * truncate("Hello, world!", 8, { position: "start" }); // "…world!"
 * truncate("Hello, world!", 8, { position: "middle" }); // "Hell…ld!"
 * truncate("one two three four", 12, { position: "start", preserveWords: true }); // "…three four"
 * truncate("one two three four five", 15, { position: "middle", preserveWords: true }); // "one two…five"
 * truncate(["A", "B"]); // ""
 */
export function truncate(
	string,
	length = 10,
	{
		decoration = "…",
		includeDecoration = true,
		preserveWords = false,
		strict = true,
		position = "end",
	} = {},
) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	if (!isNumber(length) || string.length <= length) {
		return string;
	}

	decoration = validateOrFallback(decoration, isNonEmptyString, "…");

	// Validate position, falling back to "end" for any unrecognised value.
	if (!["start", "middle", "end"].includes(position)) {
		position = "end";
	}

	// If we need to include the decoration in the length, modify our length
	// accordingly.
	if (includeDecoration === true) {
		length = length - decoration.length;
	}

	// Clamp to avoid negative lengths after decoration subtraction.
	if (length < 0) {
		length = 0;
	}

	// Character-based truncation.
	if (!preserveWords) {
		if (position === "start") {
			return `${decoration}${string.substring(string.length - length).trim()}`;
		}

		if (position === "middle") {
			// Reserve characters for the start of the string.
			const startLength = Math.ceil(length / 2);
			// Reserve characters for the end of the string.
			const endLength = Math.floor(length / 2);

			return `${string.substring(0, startLength).trim()}${decoration}${string.substring(string.length - endLength).trim()}`;
		}

		return `${string.substring(0, length).trim()}${decoration}`;
	}

	// Word-based truncation.
	const words = string.split(" ");

	if (position === "start") {
		// Keep the selected words for the result.
		const { text } = takeWords(words, length, { direction: "end", strict });

		return `${decoration}${text}`;
	}

	if (position === "middle") {
		// Reserve word space for the start of the string.
		const startBudget = Math.ceil(length / 2);
		// Reserve word space for the end of the string.
		const endBudget = Math.floor(length / 2);
		// Collect words from the start within its budget.
		const start = takeWords(words, startBudget, { strict });
		// Collect words from the end within its budget.
		const end = takeWords(words, endBudget, { direction: "end", stopIndex: start.index, strict });

		return `${start.text}${decoration}${end.text}`;
	}

	// Keep the selected words for the result.
	const { text } = takeWords(words, length, { strict });

	return `${text}${decoration}`;
}

/**
 * Collect whole words from one side of a string within a character budget.
 *
 * @param  {string[]}  words
 *     Words to collect from.
 * @param  {number}  budget
 *     Maximum character budget before decoration is added.
 * @param  {object}  options
 *     Collection behaviour.
 * @param  {string}  [options.direction="start"]
 *     Which end of the words to read from.
 * @param  {number}  [options.stopIndex=-1]
 *     The word index to stop before.
 * @param  {boolean}  [options.strict=true]
 *     Whether to stay within the character budget.
 *
 * @returns  {{ text: string, index: number }}
 *     The selected words as text, and the index of the last word included.
 */
function takeWords(words, budget, { direction = "start", stopIndex = -1, strict = true } = {}) {
	// Choose the direction used to collect words.
	const isTakingFromEnd = direction === "end";
	// Move one word towards the chosen end.
	const step = isTakingFromEnd ? -1 : 1;
	// Stop before the opposing group of words.
	const finalIndex = isTakingFromEnd ? stopIndex : words.length;

	// Track the next word to consider.
	let index = isTakingFromEnd ? words.length - 1 : 0;
	// Remember the last word included in the result.
	let lastUsedIndex = isTakingFromEnd ? words.length : -1;
	// Collect the words within this character budget.
	let text = "";

	while (isTakingFromEnd ? index > finalIndex : index < finalIndex) {
		// Read the current word.
		const word = words[index];
		// Allow for a space between selected words.
		const separatorLength = text ? 1 : 0;

		if (strict && text.length + separatorLength + word.length > budget) {
			break;
		}

		text = isTakingFromEnd ? word + (text ? " " : "") + text : text + (text ? " " : "") + word;
		lastUsedIndex = index;

		if (text.length >= budget) {
			break;
		}

		index += step;
	}

	return {
		index: lastUsedIndex,
		text,
	};
}
