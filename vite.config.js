import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	build: {
		lib: {
			entry: getFiles([
				"array",
				"general",
				"number",
				"object",
				"string",
			]),
			name: "helpers",
			fileName: "[name]",
			formats: ["cjs", "es"],
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
	return folderNames.map(folderName => getFile(folderName));
}

/**
 * Get the path to a group of library helpers from a folder name.
 *
 * @param  {string}  folderName
 *     The name of the folder to retrieve.
 */
function getFile(folderName) {
	return fileURLToPath(new URL(`./lib/${folderName}/${folderName}.js`, import.meta.url));
}
