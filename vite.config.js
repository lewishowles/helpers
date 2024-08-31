import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	resolve: {
		alias: {
			"@array": fileURLToPath(new URL("./lib/array/array", import.meta.url)),
			"@general": fileURLToPath(new URL("./lib/general/general", import.meta.url)),
			"@number": fileURLToPath(new URL("./lib/number/number", import.meta.url)),
			"@object": fileURLToPath(new URL("./lib/object/object", import.meta.url)),
			"@string": fileURLToPath(new URL("./lib/string/string", import.meta.url)),
			"@vue": fileURLToPath(new URL("./lib/vue/vue", import.meta.url)),
			"@chart": fileURLToPath(new URL("./lib/chart/chart", import.meta.url)),
		},
	},
	build: {
		lib: {
			entry: getFiles([
				"array",
				"general",
				"number",
				"object",
				"string",
				"vue",
				"chart",
			]),
			name: "helpers",
			fileName: "[name]",
			formats: ["cjs", "es"],
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
