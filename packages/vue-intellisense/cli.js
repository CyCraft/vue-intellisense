#!/usr/bin/env node
'use strict'
const meow = require('meow')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { isFullString } = require('is-what')
const { generateVeturFiles } = require('@vue-intellisense/scripts')

const cli = meow(
  `
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
`,
  {
    flags: {
      input: {
        alias: 'i',
        type: 'string',
        isRequired: true,
      },
      output: {
        alias: 'o',
        type: 'string',
        isRequired: true,
      },
      recursive: {
        alias: 'r',
        type: 'boolean',
        default: false,
      },
    },
  }
)

const { flags } = cli
const { input, output, recursive } = flags

if (!isFullString(input)) {
  console.error('Specify an input: --input <some/path>')
  process.exit(1)
}
if (!isFullString(output)) {
  console.error('Specify an output: --output <some/path>')
  process.exit(1)
}

const spinner = ora(`Generating files`).start()
;(async () => {
  await generateVeturFiles(input, output, { recursive })

  spinner.stop()

  console.log(`${logSymbols.success} ${chalk.bold('done')}!`)

  process.exit(0)
})().catch((error) => {
  spinner.stop()

  console.error(error)

  process.exit(1)
})
