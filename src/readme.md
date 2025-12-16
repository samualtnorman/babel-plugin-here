<%
if (!process.env.FULL_ERROR) {
  process.on(`uncaughtException`, error => {
    console.error(error.message)
    process.exit(1)
  })
}

const { readFileSync } = await import("fs")
const { expectTruthy } = await import(`@samual/assert`)
const { TARGET, JSR_NAME } = process.env
const packageJson = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }))
const PackageName = TARGET == `jsr` ? expectTruthy(JSR_NAME, `Missing JSR_NAME`) : packageJson.name
%>
# Babel Plugin Here (`<%= PackageName %>`)
> Replace instances of `HERE` identifier with code position strings.

## Why?
This plugin is useful when you don't have sourcemaps and you're looking at errors in the console and having trouble
knowing where they've come from. You can setup this plugin, and use `HERE` in error message like
``throw new Error(`${HERE} Some useful message`)``.

## Setup
<% if (TARGET == `git`) { %>
### Install
```sh
npm install --save-dev <%= PackageName %>

```
<% } %>

### Babel config

`babel.config.json`

```json
{
	"plugins": [ "<%= PackageName %>" ]
}
```

### TSConfig (if using TypeScript)

`tsconfig.json`
```ts
{
	"compilerOptions": {
		"types": [ "<%= PackageName %>/env" ]
	}
}
```

## Example
### In
`src/foo.js`

```js
console.log(HERE)
```

### Out

`dist/foo.js`

```js
console.log("src/foo.js:1:13")
```
