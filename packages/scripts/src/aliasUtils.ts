import logSymbols from 'log-symbols'
import chalk from 'chalk'
import { merge } from 'merge-anything'
import { getProp } from 'path-to-prop'
import * as fs from 'fs'
import * as path from 'path'
import { isObject, isNullOrUndefined, isPlainObject } from 'is-what'
import { CompilerOptions } from 'typescript'

function getAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
}

function readJsTsConfig(jsTsConfigPath: string) {
  const tsconfigAbsolutePath = getAbsolutePath(jsTsConfigPath)
  if (!fs.existsSync(tsconfigAbsolutePath)) return null
  const tsconfig = require(tsconfigAbsolutePath)
  return tsconfigAbsolutePath.endsWith('.json') && tsconfig
}

/**
 * Author @author phuctm97 {@link https://gist.github.com/nerdyman/2f97b24ab826623bff9202750013f99e}
 * Helper function infers Webpack aliases from tsconfig.json compilerOptions.baseUrl and
 * compilerOptions.paths.
 *
 * Convert
 * `"@src/*": ["./src/*"],
 * "@src": [
 *   "./src/index.ts",
 * ]`
 * to  `"@src": "./src"`
 * @param {string} jsTsConfigPath - Path to tsconfig.json or jsconfig.json (Can be either relative or absolute path).
 */
function pathsToAliasMapping(jsTsConfigPath = './tsconfig.json') {
  const jsTsConfig = readJsTsConfig(jsTsConfigPath)
  if (!jsTsConfig || !jsTsConfig.compilerOptions) return {}
  const { paths, baseUrl }: CompilerOptions = jsTsConfig.compilerOptions

  if (isObject(paths))
    return Object.fromEntries(
      Object.entries(paths)
        .filter(([, pathValues]) => pathValues.length > 0)
        .map(([pathKey, pathValues]) => {
          const key = pathKey.replace('/*', '')
          const pathValue = pathValues.find((p) => p.endsWith('/*'))
          const pathValueMapDir = pathValue
            ? pathValue.replace('/*', '')
            : pathValues[0].substring(0, pathValues[0].lastIndexOf('/'))
          const value = path.resolve(path.dirname(jsTsConfigPath), baseUrl || '.', pathValueMapDir)
          return [key, value]
        })
        .filter(([, pathValues]) => !isNullOrUndefined(pathValues))
    )
  return {}
}

/**
 * extract alias file config absolute path and nested property by dot
 * @param {string} alias
 */
function extractAliasPath(alias: string) {
  const [configFilePath, ...aliasNested] = alias.replace(/^#|#$/g, '').split('#')
  const aliasAbsolutePath = getAbsolutePath(configFilePath)
  if (!fs.existsSync(aliasAbsolutePath)) {
    throw new Error(`[vue-intellisense] ${aliasAbsolutePath} is not found`)
  }
  // not nested alias
  if (aliasNested.length === 0) {
    return { aliasAbsolutePath, nestedPropsByDot: '' }
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
  return getProp(configFile, nestedPropsByDot) || null
}

function readAndParseAlias(rawAliases: string[]) {
  let parsedAliase: Record<string, string> = {}
  // contain merged aliase of all file config
  rawAliases.forEach((rawAlias: string) => {
    const { aliasAbsolutePath, nestedPropsByDot } = extractAliasPath(rawAlias)
    if (aliasAbsolutePath.endsWith('.json')) {
      // check and parse if input alias is js/ts config file
      const alias = pathsToAliasMapping(aliasAbsolutePath)
      parsedAliase = merge(parsedAliase, alias)
      return
    }
    const extractedAliasObj = getAliasFromFilePath(aliasAbsolutePath, nestedPropsByDot)
    if (!extractedAliasObj) {
      throw new Error(`[vue-intellisense] ${rawAlias} is not contain alias config object`)
    }
    if (isPlainObject(extractedAliasObj)) parsedAliase = merge(parsedAliase, extractedAliasObj)
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
    }
  }
}
export { handleWarningMissingAlias, readAndParseAlias }
