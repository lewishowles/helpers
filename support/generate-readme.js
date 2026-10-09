#!/usr/bin/env node

// Automatically generate helper references from their JSDoc in README,
// replacing content between two markers.
import { spawnSync } from "node:child_process";

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// The marker where generated helper documentation starts in the README.
const readmeStartMarker = "<!-- helpers:start -->";
// The marker where generated helper documentation ends in the README.
const readmeEndMarker = "<!-- helpers:end -->";
// Category heading labels that do not follow plain title case.
const categoryTitles = { url: "URL" };
// The repository root is the parent folder of this support script.
const repoRoot = path.resolve(import.meta.dirname, "..");
// The command mode decides whether to write README.md or only check it.
const shouldCheckReadme = process.argv.includes("--check");

/**
 * Generate the helper reference in README.md from structured helper JSDoc.
 */
function generateReadme() {
	// The current README and its generated replacement.
	const { nextReadme, readme, readmePath } = getGeneratedReadme();

	if (shouldCheckReadme) {
		checkReadme(readme, nextReadme);

		return;
	}

	fs.writeFileSync(readmePath, nextReadme);
}

/**
 * Get the current and generated README content.
 *
 * @returns  {object}
 *     The current README, its generated replacement, and the README path.
 */
function getGeneratedReadme() {
	// The README file to read or update.
	const readmePath = path.join(repoRoot, "README.md");
	// The current README content.
	const readme = fs.readFileSync(readmePath, "utf8");
	// The reference built from public helper docs.
	const reference = renderHelperReference(loadHelperDocs());
	// The README with its reference replaced.
	const generatedReadme = replaceGeneratedReference(readme, reference);
	// The formatted README ready to compare or write.
	const nextReadme = formatReadme(generatedReadme);

	return { nextReadme, readme, readmePath };
}

/**
 * Format generated README content with the repository formatter.
 *
 * @param  {string}  readme
 *     The generated README content.
 *
 * @throws  {Error}
 *     If the formatter fails.
 *
 * @returns  {string}
 *     The formatted README content.
 */
export function formatReadme(readme) {
	// The output of the project formatter, which keeps the generated README
	// identical to what lint expects.
	const result = spawnSync("bunx", ["vp", "fmt", "--stdin-filepath=README.md"], {
		cwd: repoRoot,
		encoding: "utf8",
		input: readme,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr || "Unable to format generated README content.");
	}

	return result.stdout;
}

/**
 * Fail when the README helper reference is out of date.
 *
 * @param  {string}  readme
 *     The current README content.
 * @param  {string}  nextReadme
 *     The generated README content.
 */
function checkReadme(readme, nextReadme) {
	if (readme === nextReadme) {
		return;
	}

	// Presentation of this failure is owned by support/check-readme.sh, so
	// this only needs to signal failure via the exit code.
	process.exit(1);
}

/**
 * Load structured JSDoc for every helper exported from a public category
 * barrel.
 *
 * @returns  {object[]}
 *     The public categories and their helper docs.
 */
function loadHelperDocs() {
	return getPublicCategories().map((category) => ({
		category,
		docs: loadCategoryDocs(category),
	}));
}

/**
 * Get every category with a public barrel file.
 *
 * @returns  {string[]}
 *     The names of public categories.
 */
function getPublicCategories() {
	return fs
		.readdirSync(path.join(repoRoot, "lib"), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((category) => fs.existsSync(path.join(repoRoot, "lib", category, `${category}.js`)))
		.sort(compareAlphabetically);
}

/**
 * Load structured JSDoc for every export in the provided category.
 *
 * @param  {string}  category
 *     The category folder to load docs for.
 *
 * @throws  {Error}
 *     If the category barrel is missing, or a helper's docs are missing or name
 *     another category.
 *
 * @returns  {object[]}
 *     The documented helpers in the category.
 */
function loadCategoryDocs(category) {
	// The public barrel file for this category.
	const barrelPath = path.join(repoRoot, "lib", category, `${category}.js`);

	if (!fs.existsSync(barrelPath)) {
		throw new Error(`Missing category barrel: lib/${category}/${category}.js`);
	}

	// The category barrel source.
	const barrel = fs.readFileSync(barrelPath, "utf8");
	// The helpers exported by the category barrel.
	const exports = getBarrelExports(barrel);

	return exports
		.map(({ helperFile, helperName }) => {
			// The source file for this exported helper.
			const helperPath = path.join(repoRoot, "lib", category, `${helperFile}.js`);
			// The helper source containing its JSDoc.
			const source = fs.readFileSync(helperPath, "utf8");
			// The helper docs parsed from its source.
			const docs = parseHelperDocs(source, helperName, `lib/${category}/${helperFile}.js`);

			if (docs.category.toLowerCase() !== category) {
				throw new Error(`${helperName} has category ${docs.category}, expected ${category}`);
			}

			return docs;
		})
		.sort((left, right) => compareAlphabetically(left.helper, right.helper));
}

/**
 * Read public helper exports from a category barrel.
 *
 * @param  {string}  barrel
 *     The category barrel source.
 *
 * @returns  {object[]}
 *     The helper names and source file names.
 */
function getBarrelExports(barrel) {
	return barrel
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("export { "))
		.map((line) => {
			// The export name and import path from the barrel line.
			const [exportClause, importPath] = line.split(" from ");
			// The name exported by this barrel line.
			const helperName = exportClause.replace("export { ", "").replace(" }", "");
			// The helper source file name without its extension.
			const helperFile = importPath.replace('"./', "").replace('.js";', "");

			return { helperFile, helperName };
		});
}

/**
 * Parse structured JSDoc for a single helper export.
 *
 * @param  {string}  source
 *     The helper source code.
 * @param  {string}  helperName
 *     The exported helper name.
 * @param  {string}  helperPath
 *     The helper path for error messages.
 *
 * @throws  {Error}
 *     If required structured docs are missing or name another helper.
 *
 * @returns  {object}
 *     The structured docs for the helper.
 */
function parseHelperDocs(source, helperName, helperPath) {
	// The helper source split into lines.
	const lines = source.split("\n");
	// The index of the helper export line.
	const exportLineIndex = findExportLine(lines, helperName);
	// The JSDoc block preceding the export.
	const docBlock = getDocBlockBeforeLine(lines, exportLineIndex);

	if (!docBlock) {
		throw new Error(`${helperPath} is missing structured docs for ${helperName}`);
	}

	// The structured tags parsed from JSDoc.
	const docs = parseTags(docBlock);

	// The required tags that have no value.
	const missing = ["helper", "category", "signature", "description"].filter(
		(tag) => !docs[tag] || docs[tag].trim() === "",
	);

	if (missing.length) {
		throw new Error(`${helperPath} is missing @${missing.join(", @")}`);
	}

	if (docs.helper !== helperName) {
		throw new Error(`${helperPath} documents ${docs.helper}, expected ${helperName}`);
	}

	return docs;
}

/**
 * Find the line where a helper is exported.
 *
 * @param  {string[]}  lines
 *     The helper source lines.
 * @param  {string}  helperName
 *     The exported helper name.
 *
 * @returns  {number}
 *     The export line index, or -1 if absent.
 */
function findExportLine(lines, helperName) {
	return lines.findIndex((line) =>
		[
			`export class ${helperName}`,
			`export const ${helperName}`,
			`export function ${helperName}`,
			`export async function ${helperName}`,
		].some((prefix) => line.startsWith(prefix)),
	);
}

/**
 * Get the JSDoc block immediately before an export line.
 *
 * @param  {string[]}  lines
 *     The helper source lines.
 * @param  {number}  lineIndex
 *     The export line index.
 *
 * @returns  {string}
 *     The preceding JSDoc block, or an empty string.
 */
function getDocBlockBeforeLine(lines, lineIndex) {
	if (lineIndex <= 0 || lines[lineIndex - 1] !== " */") {
		return "";
	}

	// The start of the JSDoc block preceding the export.
	const blockStart = lines.lastIndexOf("/**", lineIndex - 1);

	if (blockStart === -1) {
		return "";
	}

	return lines.slice(blockStart, lineIndex).join("\n");
}

/**
 * Parse supported structured tags from a JSDoc block.
 *
 * @param  {string}  docBlock
 *     The raw JSDoc block.
 *
 * @returns  {object}
 *     The parsed tags, keyed by tag name. Parameters, exceptions, and examples
 *     are lists in source order. The return value and each exception have a
 *     type and a description; every other tag is text.
 */
export function parseTags(docBlock) {
	// The structured tags collected from this block.
	const docs = { params: [], throws: [], examples: [] };

	// The tag receiving continuation lines.
	let currentTag = null;

	// The JSDoc body lines without comment markers.
	const lines = docBlock.split("\n").slice(1, -1).map(cleanJSDocLine);

	for (const line of lines) {
		if (line.startsWith("@")) {
			// The boundary between the tag name and its first value.
			const tagNameEnd = line.indexOf(" ");
			// The tag's name without the leading "@".
			const tagName = tagNameEnd === -1 ? line.slice(1) : line.slice(1, tagNameEnd);
			// The text on the tag's own line, if it has any, without the spaces
			// that align it after the tag name.
			const tagValue = tagNameEnd === -1 ? "" : line.slice(tagNameEnd + 1).trimStart();

			// The list of examples takes a plural name, like params; throws
			// already reads as plural.
			currentTag = tagName === "example" ? "examples" : tagName;

			if (currentTag === "param") {
				docs.params.push(parseParamTag(tagValue));
				continue;
			}

			if (currentTag === "throws" || currentTag === "examples") {
				docs[currentTag].push(tagValue);
				continue;
			}

			docs[currentTag] = tagValue;
			continue;
		}

		if (currentTag === "param") {
			if (line.trim() === "") {
				continue;
			}

			// The parameter receiving this description line.
			const param = docs.params.at(-1);

			param.description += `${param.description ? "\n" : ""}${line.trim()}`;
			continue;
		}

		if (currentTag) {
			if (currentTag === "throws" || currentTag === "examples") {
				// The most recent block receives this continuation line.
				const lastIndex = docs[currentTag].length - 1;

				docs[currentTag][lastIndex] += `\n${line}`;
				continue;
			}

			// Every continuation line starts on a new line, even under a tag
			// with no text of its own, so that the first line of a body is
			// always the text from the tag's own line.
			docs[currentTag] += `\n${line}`;
		}
	}

	// The comment formatter indents the lines under a tag by four spaces.
	// Remove the indent those lines share so the README shows them as
	// paragraphs, not code blocks, while deeper indents in examples stay.
	for (const [tag, body] of Object.entries(docs)) {
		if (tag === "params") {
			continue;
		}

		// Repeated tags are formatted one block at a time so each block keeps
		// its own Markdown indentation.
		const bodies = Array.isArray(body) ? body : [body];

		docs[tag] = bodies.map((entry) => {
			if (!entry.includes("\n")) {
				return entry;
			}

			// The text on the tag's own line, which has no indent, and the
			// lines under it.
			const [heading, ...continuation] = entry.split("\n");
			// The lines that carry text; blank lines do not limit the shared
			// indent.
			const nonBlankLines = continuation.filter((line) => line.trim() !== "");

			// The smallest indent of any line with text.
			const sharedIndent = nonBlankLines.length
				? Math.min(...nonBlankLines.map((line) => line.length - line.trimStart().length))
				: 0;

			// When the tag's own line is empty, the joined body starts with a
			// newline, which is dropped.
			return [heading, ...continuation.map((line) => line.slice(sharedIndent))]
				.join("\n")
				.replace(/^\n/, "");
		});

		// Tags other than parameters, exceptions and examples go back to plain
		// text.
		if (!Array.isArray(body)) {
			docs[tag] = docs[tag][0];
		}
	}

	if (docs.returns) {
		docs.returns = parseTypedTag(docs.returns);
	}

	docs.throws = docs.throws.map(parseTypedTag);

	return docs;
}

/**
 * Split a return or exception tag into its type and description.
 *
 * @param  {string}  body
 *     The tag text after Markdown indentation is removed.
 *
 * @returns  {object}
 *     The type and description, with an empty type when none is documented.
 */
function parseTypedTag(body) {
	// The leading type and remaining description. The type ends at the first
	// closing brace followed by a space or the end of the text. This keeps
	// nested object types and braces in the description intact.
	const match = body.match(/^\{(.+?)\}(?=\s|$)([\s\S]*)$/);

	return {
		type: match?.[1] ?? "",
		description: (match?.[2] ?? body).trim(),
	};
}

/**
 * Parse one `@param` tag's `{type}  name` header into its parts.
 *
 * @param  {string}  header
 *     The `@param` line content after the tag name, e.g. `{string}  readme`.
 *
 * @returns  {object}
 *     The parameter type, name and empty description.
 */
export function parseParamTag(header) {
	// The type and name from the parameter header.
	const [, type, name] = header.trim().match(/^\{(.+?)\}\s+(\S+)/) ?? [undefined, "", ""];

	return { type, name, description: "" };
}

/**
 * Remove the leading JSDoc marker from one line.
 *
 * @param  {string}  line
 *     The raw JSDoc line.
 *
 * @returns  {string}
 *     The line without its JSDoc marker.
 */
function cleanJSDocLine(line) {
	if (line === " *") {
		return "";
	}

	if (line.startsWith(" * ")) {
		return line.slice(3);
	}

	return line;
}

/**
 * Render the generated helper reference.
 *
 * @param  {object[]}  categories
 *     The category docs to render.
 *
 * @returns  {string}
 *     The complete generated reference section.
 */
function renderHelperReference(categories) {
	// The README section for each public category.
	const sections = categories.map(({ category, docs }) => {
		// The rendered helper entries for this category.
		const helpers = docs.map(renderHelperDocs).join("\n\n");
		// The heading label for this category.
		const categoryTitle = categoryTitles[category] ?? toTitleCase(category);

		return [`## ${categoryTitle}`, helpers].join("\n\n");
	});

	return [readmeStartMarker, sections.join("\n\n"), readmeEndMarker].join("\n\n");
}

/**
 * Render README docs for one helper.
 *
 * @param  {object}  docs
 *     The structured docs for a helper.
 *
 * @returns  {string}
 *     The README section for one helper.
 */
export function renderHelperDocs(docs) {
	// The heading and description for this helper.
	const parts = [`### \`${docs.signature.trim()}\``, docs.description.trim()];

	if (docs.params.length) {
		// The rendered parameter descriptions.
		const parameters = docs.params
			.map(({ description, name, type }) => `- \`${name}\` \`{${type}}\` — ${description}`)
			.join("\n");

		parts.push(["#### Parameters", parameters].join("\n\n"));
	}

	if (docs.returns) {
		// The return line shown under its heading.
		const returns = formatTypedTag(docs.returns);

		parts.push(["#### Returns", returns].join("\n\n"));
	}

	if (docs.throws?.length) {
		// One bullet for each documented exception.
		const exceptions = docs.throws.map((entry) => `- ${formatTypedTag(entry)}`).join("\n");

		parts.push(["#### Throws", exceptions].join("\n\n"));
	}

	if (docs.note?.trim()) {
		parts.push(docs.note.trim());
	}

	// The examples that have code to show, skipping empty example tags.
	const examples = docs.examples?.map((example) => example.trim()).filter(Boolean) ?? [];

	if (examples.length) {
		// One JavaScript fence for each example.
		const fences = examples.map((example) => ["```js", example, "```"].join("\n")).join("\n\n");
		// Helpers with several examples get a plural heading.
		const heading = examples.length === 1 ? "#### Example" : "#### Examples";

		parts.push([heading, fences].join("\n\n"));
	}

	return parts.join("\n\n");
}

/**
 * Format a documented type and description for the README.
 *
 * @param  {object}  entry
 *     The parsed return or exception tag.
 *
 * @returns  {string}
 *     The type in code formatting and the description after a dash, or
 *     whichever part is documented.
 */
function formatTypedTag(entry) {
	if (!entry.type) {
		return entry.description;
	}

	if (!entry.description) {
		return `\`{${entry.type}}\``;
	}

	return `\`{${entry.type}}\` — ${entry.description}`;
}

/**
 * Replace the generated section in the current README content.
 *
 * @param  {string}  readme
 *     The current README content.
 * @param  {string}  reference
 *     The generated helper reference.
 *
 * @throws  {Error}
 *     If the README has no generated section or Array heading.
 *
 * @returns  {string}
 *     The README with its generated section replaced.
 */
export function replaceGeneratedReference(readme, reference) {
	// The start of the generated README section.
	const startIndex = readme.indexOf(readmeStartMarker);
	// The end of the generated README section.
	const endIndex = readme.indexOf(readmeEndMarker);

	if (startIndex !== -1 && endIndex !== -1) {
		// The README content before the generated section.
		const beforeReference = readme.slice(0, startIndex).trimEnd();
		// The README content after the generated section.
		const afterReference = readme.slice(endIndex + readmeEndMarker.length).trimStart();

		return `${beforeReference}\n\n${reference}\n${afterReference}`.trimEnd() + "\n";
	}

	// The first legacy category heading when markers are absent.
	const firstCategoryIndex = findHeadingIndex(readme, "## Array");

	if (firstCategoryIndex === -1) {
		throw new Error("README.md has no generated markers and no ## Array section to replace");
	}

	return `${readme.slice(0, firstCategoryIndex).trimEnd()}\n\n${reference}\n`;
}

/**
 * Find where a heading starts in a Markdown document.
 *
 * @param  {string}  content
 *     The Markdown content to search.
 * @param  {string}  heading
 *     The exact heading to find.
 *
 * @returns  {number}
 *     The character offset where the heading starts, or -1 if absent.
 */
function findHeadingIndex(content, heading) {
	// The document split into lines.
	const lines = content.split("\n");

	// The character offset of the current line.
	let offset = 0;

	for (const line of lines) {
		if (line === heading) {
			return offset;
		}

		offset += line.length + 1;
	}

	return -1;
}

/**
 * Compare two values alphabetically without case changing their order.
 *
 * @param  {string}  left
 *     The first value to compare.
 * @param  {string}  right
 *     The second value to compare.
 *
 * @returns  {number}
 *     A negative, zero or positive number for sorting.
 */
function compareAlphabetically(left, right) {
	return left.localeCompare(right, undefined, { sensitivity: "base" });
}

/**
 * Convert a category folder name to a README heading.
 *
 * @param  {string}  value
 *     The folder name to convert.
 *
 * @returns  {string}
 *     The category heading label.
 */
function toTitleCase(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	generateReadme();
}
