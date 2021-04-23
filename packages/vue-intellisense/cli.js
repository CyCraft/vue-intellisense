#!/usr/bin/env node
'use strict'
const meow = require('meow')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { isFullString } = require('is-what')
const { generateVeturFiles } = require('@vue-intellisense/scripts')
const at = require('lodash/at')
const merge = require('lodash/merge')
const fs = require('fs')
const path = require('path')

const cli = meow(
  `
  Usage
    $ vue-int --input <path> --output <path>

  Options
    --output, -o  A folder to save the generated files.
    --input, -i  Either a Vue file, or a folder with vue components. In case it's a folder, it will not care about nested folders.
    --recursive, -r  consider all vue files in all nested folders as well.
    --alias, -a A file contain alias config.
  Examples
    # target a specific Vue file to generate IntelliSense for
    $ vue-int --output 'vetur' --input 'src/components/MyButton.vue'

    # target all files in a folder - without nested folders
    $ vue-int --output 'vetur' --input 'src/components'

    # target all files in a folder - with nested folders
    $ vue-int --output 'vetur' --input 'src/components' --recursive

    # target all files in a folder - with nested folders and some file using alias import
    # support nested object inside config file like: { resolve: { alias: { "@components": "/src/components" } } }
    $ vue-int --output 'vetur' --input 'src/components' --recursive --alias webpack.config.js#resolve#alias

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
      alias: {
        alias: 'a',
        isMultiple: true,
        type: 'string',
      },
    },
  }
)

const { flags } = cli
const { input, output, recursive, alias } = flags

if (!isFullString(input)) {
  console.error('Specify an input: --input <some/path>')
  process.exit(1)
}
if (!isFullString(output)) {
  console.error('Specify an output: --output <some/path>')
  process.exit(1)
}

/**
 * extract alias file config absolute path and nested property by dot
 * @param {string} alias
 */
function extractAliasPath(alias) {
  const [configFilePath, ...aliasNested] = alias
    .replace(/\/+/g, '/') // replace multiple '//..' with single '/' then  trim `/` `#`
    .replace(/^\/+|\/+$|^#|#$/g, '')
    .split('#')
  const aliasAbsolutePath = path.resolve(process.cwd(), configFilePath)
  if (!fs.existsSync(aliasAbsolutePath)) {
    console.error(`${configFilePath} is not found`)
    process.exit(1)
  }
  // not nested alias
  if (aliasNested.length === 0) {
    return { aliasAbsolutePath: configFilePath, nestedPropsByDot: '' }
  }
  // example: resolve.alias
  const nestedPropsByDot = aliasNested.join('.')
  return { aliasAbsolutePath, nestedPropsByDot }
}

/**
 *
 * @param {string} aliasAbsolutePath absolute path to alias file
 * @param {string} nestedObjectByDot nested alias object in config file
 * @returns
 */
function getAliasFromFilePath(aliasAbsolutePath, nestedPropsByDot) {
  const configFile = require(aliasAbsolutePath)
  return at(configFile, nestedPropsByDot).shift() || null
}

if (!isFullString(output)) {
  console.error('Specify an output: --output <some/path>')
  process.exit(1)
}

// contain merged aliase of all file config
const parsedAliase = {}

alias.map((rawAlias) => {
  const { aliasAbsolutePath, nestedPropsByDot } = extractAliasPath(rawAlias)
  const extractedAliasObj = getAliasFromFilePath(aliasAbsolutePath, nestedPropsByDot)
  if (!extractedAliasObj) {
    console.error(`${rawAlias} is not contain alias config object`)
    process.exit(1)
  }
  return merge(parsedAliase, extractedAliasObj)
})

const spinner = ora(`Generating files`).start()
;(async () => {
  await generateVeturFiles(input, output, { recursive, alias: parsedAliase })

  spinner.stop()

  console.log(`${logSymbols.success} ${chalk.bold('done')}!`)

  process.exit(0)
})().catch((error) => {
  spinner.stop()

  console.error(error)

  process.exit(1)
})
