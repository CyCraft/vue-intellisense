#!/usr/bin/env node
'use strict'
const meow = require('meow')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { isFullString } = require('is-what')
const { generateVeturFiles } = require('@vue-intellisense/scripts')

const cli = meow(`
	Usage
	  $ vue-int --input <path> --output <path>
  Examples
    # target a specific Vue file to generate IntelliSense for
    $ vue-int --output 'vetur' --input 'src/components/MyButton.vue'

    # target all files in a folder - without nested folders
    $ vue-int --output 'vetur' --input 'src/components'

    # target all files in a folder - with nested folders
    $ vue-int --output 'vetur' --input 'src/components' --recursive
	Exits with code 0 when done or with 1 when an error has occured.
`)

const { flags } = cli
const { input, output } = flags

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
  await generateVeturFiles(input, output)

  spinner.stop()

  console.log(`${logSymbols.success} ${chalk.bold('done')}!`)

  process.exit(0)
})().catch((error) => {
  spinner.stop()

  console.error(error)

  process.exit(1)
})
