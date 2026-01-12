import { defineConfig } from "@rstest/core"
import testEnv from "./env.test.json"

export default defineConfig({
	testEnvironment: "node",
	root: "./",
	coverage: {
		enabled: true,
	},
	env: testEnv,
})
