# Vue IntelliSense

> A CLI tool to help enabling IntelliSense on your Vue components

```shell
npm i -D vue-intellisense

# or globally
npm i -g vue-intellisense
```

## Usage

You'll need VSCode and Vetur installed.

Vetur has a feature to get IntelliSense for your Vue components, however, you need to provide a bunch of config files for this.

The Vue IntelliSense CLI generates the required files with zero-config required!

### TLDR;

Generate the required Vetur files for all your Vue components:

```
vue-int --input /src/components --output vetur --recursive
```

Then add this to your package.json:

```json
{
  "vetur": {
    "tags": "vetur/tags.json",
    "attributes": "vetur/attributes.json"
  }
}
```

That's it! 🎉

### Motivation

Check out the [blog post](https://medium.com/@lucaban/vue-intellisense-in-vscode-33cf8860e092)!

### CLI Manual

```
Usage
  $ vue-int --input <path> --output <path>

Options
  --output, -o  A folder to save the generated files.
  --input, -i  Either a Vue file, or a folder with vue components. In case it's a folder, it will not care about nested folders.
  --recursive, -r  consider all vue files in all nested folders as well.

Examples
  # target a specific Vue file to generate IntelliSense for
  $ vue-int --output 'vetur' --input 'src/components/MyButton.vue'

  # target all files in a folder - without nested folders
  $ vue-int --output 'vetur' --input 'src/components'

  # target all files in a folder - with nested folders
  $ vue-int --output 'vetur' --input 'src/components' --recursive

Exits with code 0 when done or with 1 when an error has occured.
```

### Alias options

If in your component use alias import like below, you have to input alias config file(s).

```js
import ComponentA from '@src/componentA.vue'
or
import scriptA from '@components/scriptA'
```

There are 3 ways to input alias config file(s). All support multiple files

#### 1. Using tsconfig or jsconfig file

`vue-int --output 'vetur' --input 'src/components' --alias tsconfig.json other.jsconfig.json`

```json
// @file /home/user/project-dir/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".", // default = '.'
    "paths": {
      "@/*": ["./*"],
      "@": ["./index.ts", "./index.vue"],
      "@src/*": ["./src/*"],
      "@src": ["./src/index.ts", "./src/index.vue"],
      "@components/*": ["./src/components/*"],
      "@components": ["./src/components/index.ts", "./src/components/index.vue"]
    }
  }
}
```

#### 2. Using nested alias file

`vue-int --output 'vetur' --input 'src/components' --alias alias.config.js#resolve#alias other.alias.config.js#nested#alias`

```js
// @file /home/user/project-dir/alias.config.js
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      // <= this is nested #resolve#alias
      '@': path.resolve(__dirname, '.'),
      '@src': path.resolve(__dirname, './src'),
      '@views': path.resolve(__dirname, './src/views'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
}
```

#### 3. Using non-nested alias file

`vue-int --output 'vetur' --input 'src/components' --alias alias.config.js other.alias.config.js`

```js
// @file /home/user/project-dir/alias.config.js
const path = require('path')

module.exports = {
  // <= this is non-nested
  '@': path.resolve(__dirname, '.'),
  '@src': path.resolve(__dirname, './src'),
  '@views': path.resolve(__dirname, './src/views'),
  '@components': path.resolve(__dirname, './src/components'),
}
```

### Contributing

Any contribution welcome! Would love for this to work with other code editors as well!
