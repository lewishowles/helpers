import { defineConfig, mergeConfig } from "vite-plus";

import viteConfig from "./vite.config.js";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ["lib/**/*.test.js", "support/**/*.test.js"],
			// Tests run in plain Node by default, so a helper that relies on
			// browser globals fails here. A test file that needs a browser
			// adds `// @vitest-environment happy-dom` as its first line.
			environment: "node",
		},
	}),
);
