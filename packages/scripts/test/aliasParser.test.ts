import test from 'ava'
import { readAndParseAlias } from '../src/aliasUtils'
import * as path from 'path'

function resolveSrc(relativePath: string) {
  return path.resolve(process.cwd(), 'test/helpers/alias/' + relativePath)
}

function getExpectValueForMapAliases(mapAliases: Record<string, string>) {
  const expectValue: Record<string, string> = {}
  for (const alias in mapAliases) {
    const aliasTo = mapAliases[alias]
    expectValue[alias] = resolveSrc(aliasTo)
  }
  return expectValue
}

test('conrrectly get aliases in non-nested config file', (t) => {
  const input = ['test/helpers/alias/no-nested-aliases.config.js']
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
  }
  const expectValue: Record<string, string> = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = readAndParseAlias(input)
  t.deepEqual(parsedAliases, expectValue)
})

test('should throw error for non-exist file', (t) => {
  const input = ['test/helpers/alias/some-dummy-file.js']
  t.throws(
    () => {
      readAndParseAlias(input)
    },
    {
      message: /^(\[vue-intellisense\]).+(is not found)$/,
    }
  )
})

test('conrrectly get aliases in nested config file with object path', (t) => {
  const input = ['test/helpers/alias/nested-aliases.config.js#webpack#resole#alias']
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
  }
  const expectValue: Record<string, string> = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = readAndParseAlias(input)
  t.deepEqual(parsedAliases, expectValue)
})

test('conrrectly get aliases in nested config file without object path', (t) => {
  const input = ['test/helpers/alias/nested-aliases.config.js']
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
  }
  const expectValue: Record<string, string> = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = readAndParseAlias(input)
  t.notDeepEqual(parsedAliases, expectValue)
})

test('throw not when wrong nested object path', (t) => {
  const input = [
    'test/helpers/alias/no-nested-aliases.config.js',
    'test/helpers/alias/other-nested-aliases.config.js#webpack#resolve#alias', // wrong webpack
  ]
  t.throws(
    () => {
      readAndParseAlias(input)
    },
    {
      message: /^(\[vue-intellisense\]).+(is not contain alias config object)$/,
    }
  )
})

test('conrrectly merged aliases in multiple file with some object path and without object path', (t) => {
  const input = [
    'test/helpers/alias/no-nested-aliases.config.js',
    'test/helpers/alias/other-nested-aliases.config.js#config#alias',
  ]
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
    '@models': './src/models',
  }
  const expectValue: Record<string, string> = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = readAndParseAlias(input)
  t.deepEqual(parsedAliases, expectValue)
})
