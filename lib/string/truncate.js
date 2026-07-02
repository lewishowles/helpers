import { isNonEmptyString } from "./is-non-empty-string";
import { isNumber } from "../number/is-number";
import { validateOrFallback } from "../general/validate-or-fallback";

/**
 * @helper truncate
 * @category String
 * @signature truncate(string: string, length: number = 10, { decoration: string = "…", preserveWords: boolean = false, strict: boolean = true, includeDecoration: boolean = true, position: "start" | "end" | "middle" = "end" })
 * @description
 * Truncate a string to a given length, with various options for how the truncation occurs.
 *
 * @note
 * If the provided variable is not a string, returns an empty string.
 *
 * - `length`: The length to truncate the string to
 * - `decoration`: The decoration to append to the string if it is truncated
 * - `includeDecoration`: Whether to include the length of the decoration in length calculations
 * - `preserveWords`: Whether to avoid breaking a word during truncation
 * - `strict`: When preserving words, if strict the resulting length will be less than the desired length
 * - `position`: Where to truncate: `"end"` (default), `"start"`, or `"middle"`
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
			const startLength = Math.ceil(length / 2);
			const endLength = Math.floor(length / 2);

			return `${string.substring(0, startLength).trim()}${decoration}${string.substring(string.length - endLength).trim()}`;
		}

		return `${string.substring(0, length).trim()}${decoration}`;
	}

	// Word-based truncation.
	const words = string.split(" ");

	if (position === "start") {
		const { text } = takeWords(words, length, { direction: "end", strict });

		return `${decoration}${text}`;
	}

	if (position === "middle") {
		const startBudget = Math.ceil(length / 2);
		const endBudget = Math.floor(length / 2);
		const start = takeWords(words, startBudget, { strict });
		const end = takeWords(words, endBudget, { direction: "end", stopIndex: start.index, strict });

		return `${start.text}${decoration}${end.text}`;
	}

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
 *
 * @returns  {{ text: string, index: number }}
 */
function takeWords(words, budget, { direction = "start", stopIndex = -1, strict = true } = {}) {
	const isTakingFromEnd = direction === "end";
	const step = isTakingFromEnd ? -1 : 1;
	const finalIndex = isTakingFromEnd ? stopIndex : words.length;

	let index = isTakingFromEnd ? words.length - 1 : 0;
	let lastUsedIndex = isTakingFromEnd ? words.length : -1;
	let text = "";

	while (isTakingFromEnd ? index > finalIndex : index < finalIndex) {
		const word = words[index];
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
