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
 * @param  {string[]}  fileNames
 *     The names of the files to retrieve.
 */
function getFiles(fileNames) {
	return fileNames.map(fileName => getFile(fileName));
}

/**
 * Get the path to a library file from its name.
 *
 * @param  {string}  fileName
 *     The name of the file to retrieve.
 */
function getFile(fileName) {
	return fileURLToPath(new URL(`./lib/${fileName}.js`, import.meta.url));
}
