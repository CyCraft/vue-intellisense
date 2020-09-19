#!/usr/bin/env node
'use strict'
const meow = require('meow')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { generateVeturFiles } = require('./scripts')

const cli = meow(`
	Usage
	  $ vue-int <name> …
	Examples
	  $ vue-int chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  $ vue-int abc123
	  ${logSymbols.warning} ${chalk.bold('abc123')} is squatted
	  $ vue-int unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	  $ vue-int @ava
	  ${logSymbols.error} ${chalk.bold('@ava')} is unavailable
	  $ vue-int @abc123
	  ${logSymbols.success} ${chalk.bold('@abc123')} is available
	  $ vue-int @sindresorhus/is unicorn-cake
	  ${logSymbols.error} ${chalk.bold('@sindresorhus/is')} is unavailable
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	Exits with code 0 when all names are available or 2 when any names are taken
`)

const { input } = cli

if (input.length === 0) {
  console.error('Specify one or more package names')
  process.exit(1)
}

const spinner = ora(`Checking ${input.length === 1 ? 'name' : 'names'} on npmjs.com…`).start()

;(async () => {
  console.log(`input → `, input)
  console.log(`output → `, output)
  await generateVeturFiles(input, output)

  spinner.stop()

  console.log(`${logSymbols.success} done!`)

  process.exit(0)
})().catch((error) => {
  spinner.stop()

  console.error(error)

  process.exit(1)
})
