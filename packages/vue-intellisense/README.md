# Vue IntelliSense

> A CLI tool to help enabling IntelliSense on your Vue components

```shell
npm i -D vue-intellisense

# or globally
npm i -g vue-intellisense
```

## Usage

### VSCode

Vetur provides IntelliSense for Vue components. With this library you can automatically generate the required files for this to work.

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
