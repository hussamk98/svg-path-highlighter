import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

const esmAndCjsConfig = {
	input: ["src/index.ts", "src/configLoader.ts"],
	output: [
		{
			dir: "dist",
			format: "esm",
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: "src",
			entryFileNames: "[name].esm.js",
		},
		{
			dir: "dist",
			format: "cjs",
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: "src",
			entryFileNames: "[name].cjs.js",
			exports: "auto",
		},
	],
	plugins: [
		typescript(),
		json(),
		terser(),
		copy({
			targets: [{ src: "src/configs/*.json", dest: "dist/configs" }],
		}),
	],
};

const umdConfig = {
	input: "src/index.ts",
	output: {
		file: "dist/svg-path-highlighter.umd.js",
		format: "umd",
		name: "SVGPathHighlighter",
		sourcemap: true,
	},
	plugins: [
		typescript(),
		json(),
		terser(),
		copy({
			targets: [{ src: "src/configs/*.json", dest: "dist/configs" }],
		}),
	],
};

export default [esmAndCjsConfig, umdConfig];
