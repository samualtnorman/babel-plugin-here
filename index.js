import * as t from "@babel/types"
import * as Path from "path"

export const here = () => /** @type {import("@babel/core").PluginObj} */ ({
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

			const filePath = Path.relative(".", this.file.opts.filename)

			for (const referencePath of path.scope.getBinding("HERE").referencePaths) {
				const line = referencePath.node.loc.start.line
				const column = referencePath.node.loc.start.column + 1

				if (referencePath.parent.type != "TemplateLiteral") {
					referencePath.replaceWith(t.stringLiteral(`${filePath}:${line}:${column}`))

					continue
				}

				const { parent, node } = referencePath
				const index = parent.expressions.indexOf(/** @type {any} */(node))
				const quasi = parent.quasis[index].value.raw
				const nextQuasi = parent.quasis[index + 1].value.raw

				parent.expressions.splice(index, 1)
				delete parent.quasis[index].value.cooked
				parent.quasis[index].value.raw = `${quasi}${filePath}:${line}:${column}${nextQuasi}`
				parent.quasis[index].tail = parent.quasis[index + 1].tail
				parent.quasis.splice(index + 1, 1)
			}

			variableDeclarationPath.remove()
		}
	}
})

export default here
