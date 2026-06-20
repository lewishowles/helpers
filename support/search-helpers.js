#!/usr/bin/env node
// Search public helpers from structured JSDoc.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// The repository root is the parent folder of this support script.
const repoRoot = path.resolve(import.meta.dirname, "..");
// Search text passed from the command line.
const query = process.argv.slice(2).join(" ").trim().toLowerCase();
// A hidden separator used to pass helper data through fzf without colliding with descriptions.
const fieldSeparator = "\u001f";
// ANSI escape for dim terminal text.
const dim = "\u001b[2m";
// ANSI escape to reset terminal text.
const reset = "\u001b[0m";

/**
 * Search helper docs and print matching helpers.
 */
function searchHelpers() {
	const helpers = loadHelpers();

	if (!query && process.stdin.isTTY && process.stdout.isTTY && hasFzf()) {
		runFzf(helpers);
		return;
	}

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
 */
function loadHelpers() {
	return getCategories().flatMap((category) => {
		const barrelPath = path.join(repoRoot, "lib", category, `${category}.js`);
		const barrel = fs.readFileSync(barrelPath, "utf8");
		const helperFiles = [...barrel.matchAll(/from "\.\/([^"]+)\.js"/g)].map((match) => match[1]);

		return helperFiles.map((helperFile) => {
			const sourcePath = path.join(repoRoot, "lib", category, `${helperFile}.js`);
			const source = fs.readFileSync(sourcePath, "utf8");
			const docs = parseDocs(source);
			const description = docs.description.replace(/\s+/g, " ").trim();
			const searchText = [
				docs.helper,
				docs.category,
				docs.signature,
				description,
			].join(" ").toLowerCase();

			return {
				category: docs.category,
				description,
				helper: docs.helper,
				key: `${docs.category.toLowerCase()}:${docs.helper}`,
				searchText,
				signature: docs.signature,
			};
		});
	}).sort((left, right) => left.key.localeCompare(right.key));
}

/**
 * Return public category folder names.
 */
function getCategories() {
	return fs.readdirSync(path.join(repoRoot, "lib"), { withFileTypes: true })
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
 */
function parseDocs(source) {
	const block = source.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? "";
	const lines = block.split("\n").map((line) => line.replace(/^\s*\*\s?/, ""));
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
 */
function getTag(lines, tag) {
	const prefix = `@${tag} `;
	const line = lines.find((candidate) => candidate.startsWith(prefix));

	return line ? line.slice(prefix.length).trim() : "";
}

/**
 * Return the first description paragraph from parsed JSDoc lines.
 *
 * @param  {string[]}  lines
 *     Parsed JSDoc lines.
 */
function getDescription(lines) {
	const start = lines.findIndex((line) => line === "@description");

	if (start === -1) {
		return "";
	}

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
	const helperWidth = Math.max(...helpers.map((helper) => helper.helper.length));
	const rows = helpers.map((helper) => [
		helper.helper,
		helper.category,
		helper.signature,
		helper.description,
		helper.key,
		`${helper.helper.padEnd(helperWidth)}  ${dim}${helper.category}${reset}  ${helper.description}`,
	].join(fieldSeparator)).join("\n");

	const result = spawnSync("fzf", [
		"--delimiter", fieldSeparator,
		"--ansi",
		"--with-nth", "6",
		"--nth", "1,2,3,4,5",
		"--preview", `${process.argv[1]} --preview {1} {2} {3} {4} {5}`,
		"--preview-window", "down,30%,wrap",
	], {
		encoding: "utf8",
		input: rows,
		stdio: ["pipe", "pipe", "inherit"],
	});

	if (result.status !== 0 || !result.stdout.trim()) {
		return;
	}

	const [helper, category, signature, description] = result.stdout.trim().split(fieldSeparator);

	printHelper({ category, description, helper, signature });
}

/**
 * Print an fzf preview for one helper.
 */
function printPreview() {
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
 */
function wrapText(text, width) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
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
