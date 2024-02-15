#!/usr/bin/env node
import { mkdirSync as makeDirectorySync, writeFileSync } from "fs"
import packageJson_ from "../package.json" assert { type: "json" }

const /** @type {Partial<typeof packageJson_>} */ packageJson = packageJson_

delete packageJson.private
delete packageJson.devDependencies
delete packageJson.engines

makeDirectorySync("dist", { recursive: true })
writeFileSync("dist/package.json", JSON.stringify(packageJson))
process.exit()
