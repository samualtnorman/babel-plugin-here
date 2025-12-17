#!/usr/bin/env node
import { expectTruthy } from "@samual/assert"
import { mkdirSync as makeDirectorySync, writeFileSync } from "fs"
import packageJson from "../package.json" with { type: "json" }

if (!process.env.FULL_ERROR) {
	process.on(`uncaughtException`, error => {
		console.error(error.message)
		process.exit(1)
	})
}

/** @type {Record<string, string>} */ const ConvertToJsr = {
	"@samual/assert": "@sn/assert"
}

const { version, license, dependencies } = packageJson

makeDirectorySync("dist", { recursive: true })

const imports = Object.fromEntries(Object.entries(dependencies).map(
	([ name, version ]) => [
		name.startsWith(`@types/`) ?
			name.includes(`__`) ?
				`@${name.slice(7, name.indexOf(`__`))}/${name.slice(name.indexOf(`__`) + 2)}`
			: name.slice(7)
		: name,
		`${name in ConvertToJsr ? `jsr:${ConvertToJsr[name]}` : `npm:${name}`}@${version}`
	]
))

writeFileSync("dist/jsr.json", JSON.stringify({
	name: expectTruthy(process.env.JSR_NAME, `Missing JSR_NAME`),
	version,
	license,
	exports: { ".": "./default.js", "./env": "./env.d.ts" },
	imports
}, undefined, "\t"))
