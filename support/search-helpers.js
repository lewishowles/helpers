#!/usr/bin/env node
// Search public helpers from structured JSDoc.
import { spawnSync } from "node:child_process";

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// The repository root is the parent folder of this support script.
const repoRoot = path.resolve(import.meta.dirname, "..");
// Search text passed from the command line.
const query = process.argv.slice(2).join(" ").trim().toLowerCase();
// A hidden separator used to pass helper data through fzf without colliding
// with descriptions.
const fieldSeparator = "\u001f";
// ANSI escape for dim terminal text.
const dim = "\u001b[2m";
// ANSI escape to reset terminal text.
const reset = "\u001b[0m";

/**
 * Search helper docs and print matching helpers.
 */
function searchHelpers() {
	// The public helpers available to search.
	const helpers = loadHelpers();

	if (!query && process.stdin.isTTY && process.stdout.isTTY && hasFzf()) {
		runFzf(helpers);

		return;
	}

	// The helpers matching the search text.
	const matches = query ? helpers.filter((helper) => helper.searchText.includes(query)) : helpers;

	if (matches.length === 0) {
		console.log("No helpers found.");

		return;
	}

	for (const helper of matches) {
		printHelper(helper);
	}
}

/**
 * Load helper docs for every public category export.
 *
 * @returns  {object[]}
 *     The searchable public helpers.
 */
function loadHelpers() {
	return getCategories()
		.flatMap((category) => {
			// The public barrel file for this category.
			const barrelPath = path.join(repoRoot, "lib", category, `${category}.js`);
			// The category barrel source.
			const barrel = fs.readFileSync(barrelPath, "utf8");
			// The helper source files exported by the barrel.
			const helperFiles = [...barrel.matchAll(/from "\.\/([^"]+)\.js"/g)].map((match) => match[1]);

			return helperFiles.map((helperFile) => {
				// The source file for this helper.
				const sourcePath = path.join(repoRoot, "lib", category, `${helperFile}.js`);
				// The helper source containing its JSDoc.
				const source = fs.readFileSync(sourcePath, "utf8");
				// The structured docs parsed from the helper.
				const docs = parseDocs(source);
				// The helper description as searchable text.
				const description = docs.description.replace(/\s+/g, " ").trim();

				// The combined text used to match queries.
				const searchText = [docs.helper, docs.category, docs.signature, description]
					.join(" ")
					.toLowerCase();

				return {
					category: docs.category,
					description,
					helper: docs.helper,
					key: `${docs.category.toLowerCase()}:${docs.helper}`,
					searchText,
					signature: docs.signature,
				};
			});
		})
		.sort((left, right) => left.key.localeCompare(right.key));
}

/**
 * Return public category folder names.
 *
 * @returns  {string[]}
 *     The names of public categories.
 */
function getCategories() {
	return fs
		.readdirSync(path.join(repoRoot, "lib"), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((category) => fs.existsSync(path.join(repoRoot, "lib", category, `${category}.js`)))
		.sort();
}

/**
 * Parse structured helper docs from a source file.
 *
 * @param  {string}  source
 *     The helper source.
 *
 * @returns  {object}
 *     The structured helper docs.
 */
function parseDocs(source) {
	// The first JSDoc block in the helper source.
	const block = source.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? "";
	// The JSDoc lines without comment markers.
	const lines = block.split("\n").map((line) => line.replace(/^\s*\*\s?/, ""));

	// The structured fields read from this JSDoc block.
	const docs = {
		category: getTag(lines, "category"),
		description: getDescription(lines),
		helper: getTag(lines, "helper"),
		signature: getTag(lines, "signature"),
	};

	return docs;
}

/**
 * Return a single-line tag value from parsed JSDoc lines.
 *
 * @param  {string[]}  lines
 *     Parsed JSDoc lines.
 * @param  {string}  tag
 *     The tag name to read.
 *
 * @returns  {string}
 *     The tag value, or an empty string.
 */
function getTag(lines, tag) {
	// The tag prefix to find.
	const prefix = `@${tag} `;
	// The line containing the requested tag.
	const line = lines.find((candidate) => candidate.startsWith(prefix));

	return line ? line.slice(prefix.length).trim() : "";
}

/**
 * Return the first description paragraph from parsed JSDoc lines.
 *
 * @param  {string[]}  lines
 *     Parsed JSDoc lines.
 *
 * @returns  {string}
 *     The first description paragraph.
 */
function getDescription(lines) {
	// The position of the `@description` tag line.
	const start = lines.findIndex((line) => line === "@description");

	if (start === -1) {
		return "";
	}

	// The description lines before the next tag or paragraph.
	const description = [];

	for (const line of lines.slice(start + 1)) {
		if (line.startsWith("@")) {
			break;
		}

		if (!line.trim() && description.length > 0) {
			break;
		}

		if (line.trim()) {
			description.push(line.trim());
		}
	}

	return description.join(" ");
}

/**
 * Return true when fzf is available.
 *
 * @returns  {boolean}
 *     Whether fzf is available.
 */
function hasFzf() {
	return spawnSync("fzf", ["--version"], { stdio: "ignore" }).status === 0;
}

/**
 * Run interactive fzf helper search.
 *
 * @param  {object[]}  helpers
 *     The helpers to search.
 */
function runFzf(helpers) {
	// The width needed to align helper names in the chooser.
	const helperWidth = Math.max(...helpers.map((helper) => helper.helper.length));

	// The helper rows passed to fzf.
	const rows = helpers
		.map((helper) =>
			[
				helper.helper,
				helper.category,
				helper.signature,
				helper.description,
				helper.key,
				`${helper.helper.padEnd(helperWidth)}  ${dim}${helper.category}${reset}  ${helper.description}`,
			].join(fieldSeparator),
		)
		.join("\n");

	// The result of the interactive fzf search.
	const result = spawnSync(
		"fzf",
		[
			"--delimiter",
			fieldSeparator,
			"--ansi",
			"--with-nth",
			"6",
			"--nth",
			"1,2,3,4,5",
			"--preview",
			`${process.argv[1]} --preview {1} {2} {3} {4} {5}`,
			"--preview-window",
			"down,30%,wrap",
		],
		{
			encoding: "utf8",
			input: rows,
			stdio: ["pipe", "pipe", "inherit"],
		},
	);

	if (result.status !== 0 || !result.stdout.trim()) {
		return;
	}

	// The selected helper fields from fzf.
	const [helper, category, signature, description] = result.stdout.trim().split(fieldSeparator);

	printHelper({ category, description, helper, signature });
}

/**
 * Print an fzf preview for one helper.
 */
function printPreview() {
	// The helper fields passed to the preview command.
	const [, , , helper, category, signature, description, key] = process.argv;

	console.log("");
	console.log(`name:      ${key}`);
	console.log(`category:  ${category}`);
	console.log(`helper:    ${helper}`);
	console.log("");
	console.log("signature:");
	console.log(`  ${signature}`);
	console.log("");
	console.log("description:");

	for (const line of wrapText(description, 96)) {
		console.log(`  ${line}`);
	}
}

/**
 * Wrap text without splitting words.
 *
 * @param  {string}  text
 *     The text to wrap.
 * @param  {number}  width
 *     The maximum line width.
 *
 * @returns  {string[]}
 *     The wrapped lines.
 */
function wrapText(text, width) {
	// The words to wrap into lines.
	const words = text.split(/\s+/).filter(Boolean);
	// The wrapped output lines.
	const lines = [];

	// The line currently being filled.
	let line = "";

	for (const word of words) {
		if (!line) {
			line = word;
			continue;
		}

		if (`${line} ${word}`.length > width) {
			lines.push(line);

			line = word;
			continue;
		}

		line = `${line} ${word}`;
	}

	if (line) {
		lines.push(line);
	}

	return lines;
}

/**
 * Print helper details.
 *
 * @param  {object}  helper
 *     The helper details.
 */
function printHelper(helper) {
	console.log("");
	console.log(`${helper.helper} (${helper.category})`);
	console.log("");
	console.log(`  ${helper.signature}`);
	console.log("");
	console.log(`  ${helper.description}`);
	console.log("");
}

if (process.argv[2] === "--preview") {
	printPreview();
} else {
	searchHelpers();
}
