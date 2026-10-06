import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

import fmt from "./.oxfmtrc.json" with { type: "json" };
import localLint from "./.oxlintrc.json" with { type: "json" };
import baseLint from "@lewishowles/lint-config/base.json" with { type: "json" };
import commentsLint from "@lewishowles/lint-config/comments.json" with { type: "json" };
import importFormat from "@lewishowles/lint-config/imports.json" with { type: "json" };

export default defineConfig({
	staged: {
		"*": "vp check --fix",
		"{lib/**/*.js,quality.config.json}": getExportsCheckCommand,
		"{README.md,lib/**/*.js,support/generate-readme.js}": "bun run check:readme",
	},
	// The formatter settings, plus the shared import-order rules.
	fmt: { ...fmt, ...importFormat },
	// The lint settings. `vp lint` reads only this block, not `.oxlintrc.json`,
	// so the shared base and comments rules are merged here. `.oxlintrc.json`
	// still supplies the ignored paths, and its own `extends` keeps editors and
	// the plain oxlint CLI on the same rules.
	lint: {
		...baseLint,
		jsPlugins: [...baseLint.jsPlugins, ...commentsLint.jsPlugins],
		rules: { ...baseLint.rules, ...commentsLint.rules },
		overrides: [...baseLint.overrides, ...commentsLint.overrides],
		ignorePatterns: localLint.ignorePatterns,
	},
	build: {
		lib: {
			entry: getFiles([
				"index",
				"array",
				"date",
				"form",
				"general",
				"number",
				"object",
				"string",
				"vue",
				"url",
			]),
			name: "helpers",
			fileName: "[name]",
			formats: ["es"],
		},
		rollupOptions: {
			external: [
				"dayjs",
				"dayjs/plugin/customParseFormat.js",
				"dayjs/plugin/timezone.js",
				"dayjs/plugin/utc.js",
				"temporal-polyfill",
				"vue",
			],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});

/**
 * Run the exports check without staged file arguments.
 *
 * @returns  {string}
 *     Package script command.
 */
function getExportsCheckCommand() {
	return "bun run check:exports";
}

/**
 * Get the paths to multiple files from their names.
 *
 * @param  {string[]}  folderNames
 *     The names of the folders to retrieve.
 *
 * @returns  {string[]}
 *     The absolute paths to the category entry files.
 */
function getFiles(folderNames) {
	return folderNames.map((folderName) => getFile(folderName));
}

/**
 * Get the path to a group of library helpers from a folder name.
 *
 * @param  {string}  folderName
 *     The name of the folder to retrieve.
 *
 * @returns  {string}
 *     The absolute path to the category entry file.
 */
function getFile(folderName) {
	if (folderName === "index") {
		return fileURLToPath(new URL("./lib/index.js", import.meta.url));
	}

	return fileURLToPath(new URL(`./lib/${folderName}/${folderName}.js`, import.meta.url));
}
