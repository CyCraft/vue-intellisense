const logSymbols = require('log-symbols')
const chalk = require('chalk')
const { isPlainObject } = require('is-what')
const get = require('lodash/get')
const merge = require('lodash/merge')
const fs = require('fs')
const path = require('path')

/**
 * extract alias file config absolute path and nested property by dot
 * @param {string} alias
 */
function extractAliasPath(alias: string) {
  const [configFilePath, ...aliasNested] = alias.replace(/^#|#$/g, '').split('#')
  const aliasAbsolutePath = path.isAbsolute(configFilePath)
    ? configFilePath
    : path.resolve(__dirname, configFilePath)
  if (!fs.existsSync(aliasAbsolutePath)) {
    throw new Error(`[vue-intellisense] ${aliasAbsolutePath} is not found`)
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
 * @param aliasAbsolutePath
 * @param nestedPropsByDot like: resolve.alias
 * @returns
 */
function getAliasFromFilePath(aliasAbsolutePath: string, nestedPropsByDot: string) {
  const configFile = require(aliasAbsolutePath)
  if (!nestedPropsByDot) return configFile
  return get(configFile, nestedPropsByDot) || null
}

function readAndParseAlias(rawAliases: string[]) {
  let parsedAliase = {}
  // contain merged aliase of all file config
  rawAliases.map((rawAlias: string) => {
    try {
      const { aliasAbsolutePath, nestedPropsByDot } = extractAliasPath(rawAlias)

      const extractedAliasObj = getAliasFromFilePath(aliasAbsolutePath, nestedPropsByDot)
      if (!extractedAliasObj) {
        throw new Error(`[vue-intellisense] ${rawAlias} is not contain alias config object`)
      }
      if (isPlainObject(extractedAliasObj)) parsedAliase = merge(parsedAliase, extractedAliasObj)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })
  return parsedAliase
}
/**
 *  Make console.warn throw, so that we can check warning aliase config not correct
 */
function handleWarningMissingAlias() {
  const warn = console.warn
  console.warn = function (message: string, ...args: any[]) {
    warn.apply(console, args)
    if (['Neither', 'nor', 'or', 'could be found in'].every((msg) => message.includes(msg))) {
      console.log(
        `${logSymbols.error} ${chalk.bold(
          '[vue-intellisense] Your aliases config is missing or wrong'
        )}!`
      )
      console.error(message)
      process.exit(1)
    }
  }
}
export { handleWarningMissingAlias, readAndParseAlias }
