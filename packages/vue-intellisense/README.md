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
  --alias, -a  List files contain aliases config.

Examples
  # target a specific Vue file to generate IntelliSense for
  $ vue-int --output 'vetur' --input 'src/components/MyButton.vue'

  # target all files in a folder - without nested folders
  $ vue-int --output 'vetur' --input 'src/components'

  # target all files in a folder - with nested folders
  $ vue-int --output 'vetur' --input 'src/components' --recursive

  # target all files in a folder - with nested folders and and using alias for import
  $ vue-int --output 'vetur' --input 'src/components' --recursive --alias alias.config.js other-alias.config.js

  # support nested object inside config file like: { resolve: { alias: { "@components": "/src/components" } } }
  $ vue-int --output 'vetur' --input 'src/components' --recursive --alias webpack.config.js#resolve#alias other-alias.config.js

Exits with code 0 when done or with 1 when an error has occured.
```

### Contributing

Any contribution welcome! Would love for this to work with other code editors as well!
