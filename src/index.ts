import type { PluginObj } from "@babel/core"
import * as t from "@babel/types"
import { assert, ensure } from "@samual/lib/assert"
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
			const filePath = Path.relative(".", ensure(this.file.opts.filename, HERE))

			for (const referencePath of ensure(path.scope.getBinding("HERE"), HERE).referencePaths) {
				assert(referencePath.node.loc, HERE)
				const line = referencePath.node.loc.start.line
				const column = referencePath.node.loc.start.column + 1

				if (referencePath.parent.type != "TemplateLiteral") {
					referencePath.replaceWith(t.stringLiteral(`${filePath}:${line}:${column}`))
					continue
				}

				const { parent, node } = referencePath
				const index = parent.expressions.indexOf(node as any)
				const quasi = ensure(parent.quasis[index], HERE)
				const nextQuasi = ensure(parent.quasis[index + 1], HERE)
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

