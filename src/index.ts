import type { PluginObj } from "@babel/core"
import * as t from "@babel/types"
import { assert, expect } from "@sn/assert"
import * as Path from "path"

export const babelPluginHere = (): PluginObj => ({
	name: "babel-plugin-here",
	visitor: {
		Program(path) {
			if (!path.scope.hasGlobal("HERE"))
				return

			const [ variableDeclarationPath ] = path.unshiftContainer(
				"body",
				t.variableDeclaration("let", [ t.variableDeclarator(t.identifier("HERE")) ])
			)

			path.scope.crawl()
			assert(this.file.opts.filename, HERE)
			const questionMarkIndex = this.file.opts.filename.indexOf("?")

			const filePath = Path.relative(
				".",
				questionMarkIndex > 0 ? this.file.opts.filename.slice(0, questionMarkIndex) : this.file.opts.filename
			)

			for (const referencePath of expect(path.scope.getBinding("HERE"), HERE).referencePaths) {
				assert(referencePath.node.loc, HERE)
				const line = referencePath.node.loc.start.line
				const column = referencePath.node.loc.start.column + 1

				if (referencePath.parent.type != "TemplateLiteral") {
					referencePath.replaceWith(t.stringLiteral(`${filePath}:${line}:${column}`))
					continue
				}

				const { parent, node } = referencePath
				const index = parent.expressions.indexOf(node as any)
				const quasi = expect(parent.quasis[index], HERE)
				const nextQuasi = expect(parent.quasis[index + 1], HERE)
				parent.expressions.splice(index, 1)
				delete quasi.value.cooked
				quasi.value.raw = `${quasi.value.raw}${filePath}:${line}:${column}${nextQuasi.value.raw}`
				quasi.tail = nextQuasi.tail
				parent.quasis.splice(index + 1, 1)
			}

			variableDeclarationPath.remove()
		}
	}
})

export { babelPluginHere as default, babelPluginHere as here }
