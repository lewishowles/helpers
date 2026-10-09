import { defineConfig, mergeConfig } from "vite-plus";

import viteConfig from "./vite.config.js";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			// The coverage report lists helper code only, so it leaves out
			// tests and the barrel files that only re-export helpers.
			coverage: {
				provider: "v8",
				include: ["lib/**/*.js"],
				exclude: [
					"**/*.test.js",
					"lib/index.js",
					"lib/array/array.js",
					"lib/date/date.js",
					"lib/form/form.js",
					"lib/general/general.js",
					"lib/number/number.js",
					"lib/object/object.js",
					"lib/string/string.js",
					"lib/url/url.js",
					"lib/vue/vue.js",
				],
				reporter: ["text-summary", "html"],
				reportsDirectory: "coverage",
			},
			include: ["lib/**/*.test.js", "support/**/*.test.js"],
			// Tests run in plain Node by default, so a helper that relies on
			// browser globals fails here. A test file that needs a browser
			// adds `// @vitest-environment happy-dom` as its first line.
			environment: "node",
		},
	}),
);
