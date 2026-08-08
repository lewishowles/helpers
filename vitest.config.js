import { defineConfig, mergeConfig } from "vite-plus";
import viteConfig from "./vite.config.js";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ["lib/**/*.test.js", "support/**/*.test.js"],
			environment: "happy-dom",
		},
	}),
);
