import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ["lib/**/*.test.js"],
			environment: "happy-dom",
		},
	}),
);
