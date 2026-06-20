import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import fmt from "./.oxfmtrc.json" with { type: "json" };
import lint from "./.oxlintrc.json" with { type: "json" };

export default defineConfig({
	staged: {
		"*": "vp check --fix",
		"{lib/**/*.js,support/check-exports.sh}": "bun run check:exports",
		"{README.md,lib/**/*.js,support/generate-readme.js}": "bun run check:readme",
	},
	fmt,
	lint,
	build: {
		lib: {
			entry: getFiles([
				"index",
				"array",
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
			external: ["vue"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});

/**
 * Get the paths to multiple files from their names.
 *
 * @param  {string[]}  folderNames
 *     The names of the folders to retrieve.
 */
function getFiles(folderNames) {
	return folderNames.map((folderName) => getFile(folderName));
}

/**
 * Get the path to a group of library helpers from a folder name.
 *
 * @param  {string}  folderName
 *     The name of the folder to retrieve.
 */
function getFile(folderName) {
	if (folderName === "index") {
		return fileURLToPath(new URL("./lib/index.js", import.meta.url));
	}

	return fileURLToPath(new URL(`./lib/${folderName}/${folderName}.js`, import.meta.url));
}
