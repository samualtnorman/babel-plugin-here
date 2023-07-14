# Babel Plugin Here (`babel-plugin-here`)
> Replace instances of `HERE` keyword with code position strings.

## Why?
This plugin is useful when you don't have sourcemaps and you're looking at errors in the console and having trouble knowing where they've come from. You can setup this plugin, and use `HERE` in error message like ``throw new Error(`${HERE} Some useful message`)``.

## Setup
### Install

```sh
npm install --save-dev babel-plugin-here
```

### Create Babel config

`babel.config.json`

```json
{
	"plugins": [ "babel-plugin-here" ]
}
```

### Create type declaration (if using TypeScript)

`env.d.ts`
```ts
declare const HERE: string
```

## Example
### In
`src/foo.js`

```js
console.log(HERE)
```

`dist/foo.js`

```js
console.log("src/foo.js:1:13")
```
