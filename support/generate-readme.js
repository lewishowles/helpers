#!/usr/bin/env node

// Automatically generate helper references from their JSDoc in README,
// replacing content between two markers.

import fs from "node:fs";
import path from "node:path";

// The marker where generated helper documentation starts in the README.
const readmeStartMarker = "<!-- helpers:start -->";
// The marker where generated helper documentation ends in the README.
const readmeEndMarker = "<!-- helpers:end -->";
// Category heading labels that do not follow plain title case.
const categoryTitles = { url: "URL" };
// The repository root is the parent folder of this support script.
const repoRoot = path.resolve(import.meta.dirname, "..");

/**
 * Generate the helper reference in README.md from structured helper JSDoc.
 */
function generateReadme() {
	const readmePath = path.join(repoRoot, "README.md");
	const readme = fs.readFileSync(readmePath, "utf8");
	const reference = renderHelperReference(loadHelperDocs());
	const nextReadme = replaceGeneratedReference(readme, reference);

	fs.writeFileSync(readmePath, nextReadme);
}

/**
 * Load structured JSDoc for every helper exported from a public category barrel.
 */
function loadHelperDocs() {
	return getPublicCategories().map((category) => ({
		category,
		docs: loadCategoryDocs(category),
	}));
}

/**
 * Get every category with a public barrel file.
 */
function getPublicCategories() {
	return fs.readdirSync(path.join(repoRoot, "lib"), { withFileTypes: true })
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
 */
function loadCategoryDocs(category) {
	const barrelPath = path.join(repoRoot, "lib", category, `${category}.js`);

	if (!fs.existsSync(barrelPath)) {
		throw new Error(`Missing category barrel: lib/${category}/${category}.js`);
	}

	const barrel = fs.readFileSync(barrelPath, "utf8");
	const exports = getBarrelExports(barrel);

	return exports.map(({ helperFile, helperName }) => {
		const helperPath = path.join(repoRoot, "lib", category, `${helperFile}.js`);
		const source = fs.readFileSync(helperPath, "utf8");
		const docs = parseHelperDocs(source, helperName, `lib/${category}/${helperFile}.js`);

		if (docs.category.toLowerCase() !== category) {
			throw new Error(`${helperName} has category ${docs.category}, expected ${category}`);
		}

		return docs;
	}).sort((left, right) => compareAlphabetically(left.helper, right.helper));
}

/**
 * Read public helper exports from a category barrel.
 *
 * @param  {string}  barrel
 *     The category barrel source.
 */
function getBarrelExports(barrel) {
	return barrel.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("export { "))
		.map((line) => {
			const [exportClause, importPath] = line.split(" from ");
			const helperName = exportClause.replace("export { ", "").replace(" }", "");
			const helperFile = importPath
				.replace("\"./", "")
				.replace(".js\";", "");

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
 */
function parseHelperDocs(source, helperName, helperPath) {
	const lines = source.split("\n");
	const exportLineIndex = findExportLine(lines, helperName);
	const docBlock = getDocBlockBeforeLine(lines, exportLineIndex);

	if (!docBlock) {
		throw new Error(`${helperPath} is missing structured docs for ${helperName}`);
	}

	const docs = parseTags(docBlock);
	const missing = ["helper", "category", "signature", "description"]
		.filter((tag) => !docs[tag] || docs[tag].trim() === "");

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
 */
function findExportLine(lines, helperName) {
	return lines.findIndex((line) => [
		`export class ${helperName}`,
		`export const ${helperName}`,
		`export function ${helperName}`,
	].some((prefix) => line.startsWith(prefix)));
}

/**
 * Get the JSDoc block immediately before an export line.
 *
 * @param  {string[]}  lines
 *     The helper source lines.
 * @param  {number}  lineIndex
 *     The export line index.
 */
function getDocBlockBeforeLine(lines, lineIndex) {
	if (lineIndex <= 0 || lines[lineIndex - 1] !== " */") {
		return "";
	}

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
 */
function parseTags(docBlock) {
	const docs = {};

	let currentTag = null;

	const lines = docBlock.split("\n")
		.slice(1, -1)
		.map(cleanJSDocLine);

	for (const line of lines) {
		if (line.startsWith("@")) {
			const tagNameEnd = line.indexOf(" ");

			if (tagNameEnd === -1) {
				currentTag = line.slice(1);
				docs[currentTag] = "";
				continue;
			}

			currentTag = line.slice(1, tagNameEnd);
			docs[currentTag] = line.slice(tagNameEnd + 1);
			continue;
		}

		if (currentTag) {
			docs[currentTag] += `${docs[currentTag] ? "\n" : ""}${line}`;
		}
	}

	return docs;
}

/**
 * Remove the leading JSDoc marker from one line.
 *
 * @param  {string}  line
 *     The raw JSDoc line.
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
 */
function renderHelperReference(categories) {
	const sections = categories.map(({ category, docs }) => {
		const helpers = docs.map(renderHelperDocs).join("\n\n");
		const categoryTitle = categoryTitles[category] ?? toTitleCase(category);

		return [
			`## ${categoryTitle}`,
			helpers,
		].join("\n\n");
	});

	return [
		readmeStartMarker,
		sections.join("\n\n"),
		readmeEndMarker,
	].join("\n\n");
}

/**
 * Render README docs for one helper.
 *
 * @param  {object}  docs
 *     The structured docs for a helper.
 */
function renderHelperDocs(docs) {
	const parts = [
		`### \`${docs.signature.trim()}\``,
		docs.description.trim(),
	];

	if (docs.note?.trim()) {
		parts.push(docs.note.trim());
	}

	if (docs.example?.trim()) {
		const fencedExample = [
			"```js",
			docs.example.trim(),
			"```",
		].join("\n");

		parts.push([
			"#### Example",
			fencedExample,
		].join("\n\n"));
	}

	return parts.join("\n\n");
}

/**
 * Replace the generated section in the current README content.
 *
 * @param  {string}  readme
 *     The current README content.
 * @param  {string}  reference
 *     The generated helper reference.
 */
function replaceGeneratedReference(readme, reference) {
	const startIndex = readme.indexOf(readmeStartMarker);
	const endIndex = readme.indexOf(readmeEndMarker);

	if (startIndex !== -1 && endIndex !== -1) {
		const beforeReference = readme.slice(0, startIndex).trimEnd();
		const afterReference = readme.slice(endIndex + readmeEndMarker.length).trimStart();

		return `${beforeReference}\n\n${reference}\n${afterReference}`.trimEnd() + "\n";
	}

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
 */
function findHeadingIndex(content, heading) {
	const lines = content.split("\n");
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
 */
function compareAlphabetically(left, right) {
	return left.localeCompare(right, undefined, { sensitivity: "base" });
}

/**
 * Convert a category folder name to a README heading.
 *
 * @param  {string}  value
 *     The folder name to convert.
 */
function toTitleCase(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

generateReadme();
