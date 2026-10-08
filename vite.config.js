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
	// The library build for `vp pack`. Each entry name becomes
	// `dist/<name>.js`, which the `exports` map in `package.json` points to.
	pack: {
		entry: {
			index: "./lib/index.js",
			array: "./lib/array/array.js",
			date: "./lib/date/date.js",
			form: "./lib/form/form.js",
			general: "./lib/general/general.js",
			number: "./lib/number/number.js",
			object: "./lib/object/object.js",
			string: "./lib/string/string.js",
			vue: "./lib/vue/vue.js",
			url: "./lib/url/url.js",
		},
		format: ["esm"],
		outDir: "dist",
		// The helpers run in browsers as well as Node, so the build assumes
		// neither.
		platform: "neutral",
		// Name files `.js` rather than `.mjs`, to match the `exports` map.
		fixedExtension: false,
		// The type declarations in `types` are written by hand, so the build
		// must not generate its own.
		dts: false,
		// Shorten the code as Vite's library build did, keeping line breaks.
		minify: {
			compress: true,
			mangle: true,
			codegen: false,
		},
		// Drop JSDoc and licence comments as Vite's library build did, but keep
		// the pure-call annotations that let a user's bundler remove unused
		// code.
		outputOptions: {
			comments: { annotation: true, jsdoc: false, legal: false },
		},
		// The browsers Vite's build supported by default. Without this, the
		// build targets the Node version in `engines.node` and can output
		// syntax that some of these browsers cannot run.
		target: ["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"],
		// Users install these packages themselves, so the helpers import them
		// rather than bundle a copy.
		deps: {
			neverBundle: [
				"dayjs",
				"dayjs/plugin/customParseFormat.js",
				"dayjs/plugin/timezone.js",
				"dayjs/plugin/utc.js",
				"temporal-polyfill",
				"vue",
			],
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
