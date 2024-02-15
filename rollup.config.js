#!node_modules/.bin/rollup --config
import babelPresetTypescript from "@babel/preset-typescript"
import { babel } from "@rollup/plugin-babel"
import { babelPluginHere } from "babel-plugin-here"
import prettier from "rollup-plugin-prettier"

/** @type {import("rollup").RollupOptions} */ export default {
	external: () => true,
	input: "src/index.ts",
	output: { dir: "dist", sourcemapPathTransform: relativeSourcePath => relativeSourcePath.slice(2) },
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ],
			presets: [ babelPresetTypescript ],
			plugins: [ babelPluginHere() ]
		}),
		prettier({
			parser: "espree",
			useTabs: true,
			tabWidth: 4,
			arrowParens: "avoid",
			experimentalTernaries: true,
			printWidth: 120,
			semi: false,
			trailingComma: "none"
		})
	],
	strictDeprecations: true,
	treeshake: { moduleSideEffects: false }
}
