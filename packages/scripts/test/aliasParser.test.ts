import { test, expect } from 'vitest'
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

// test('correctly get aliases in non-nested config file', async () => {
//   const input = ['test/helpers/alias/no-nested-aliases.config.js']
//   const mapAliases: Record<string, string> = {
//     '@': '.',
//     '@src': './src',
//     '@components': './src/components',
//   }
//   const expectValue = getExpectValueForMapAliases(mapAliases)
//   const parsedAliases = await readAndParseAlias(input)
//   expect(parsedAliases).toEqual(expectValue)
// })

test('should throw error for non-exist file', async () => {
  const input = ['test/helpers/alias/some-dummy-file.js']
  await expect(readAndParseAlias(input)).rejects.toMatchObject({
    message: /^(\[vue-intellisense\]).+(is not found)$/,
  })
})

test('correctly get aliases in nested config file with object path', async () => {
  const input = ['test/helpers/alias/nested-aliases.config.js#webpack#resole#alias']
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
  }
  const expectValue = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = await readAndParseAlias(input)
  expect(parsedAliases).toEqual(expectValue)
})

test('correctly get aliases in nested config file without object path', async () => {
  const input = ['test/helpers/alias/nested-aliases.config.js']
  const mapAliases: Record<string, string> = {
    '@': '.',
    '@src': './src',
    '@components': './src/components',
  }
  const expectValue = getExpectValueForMapAliases(mapAliases)
  const parsedAliases = await readAndParseAlias(input)
  expect(parsedAliases).not.toEqual(expectValue)
})

test('throw not when wrong nested object path', () => {
  const input = [
    'test/helpers/alias/no-nested-aliases.config.js',
    'test/helpers/alias/other-nested-aliases.config.js#webpack#resolve#alias', // wrong webpack
  ]
  expect(readAndParseAlias(input)).rejects.toMatchObject({
    message: /^(\[vue-intellisense\]).+(is not contain alias config object)$/,
  })
})

// test('correctly merged aliases in multiple file with some object path and without object path', async () => {
//   const input = [
//     'test/helpers/alias/no-nested-aliases.config.js',
//     'test/helpers/alias/other-nested-aliases.config.js#config#alias',
//   ]
//   const mapAliases: Record<string, string> = {
//     '@': '.',
//     '@src': './src',
//     '@components': './src/components',
//     '@models': './src/models',
//   }
//   const expectValue = getExpectValueForMapAliases(mapAliases)
//   const parsedAliases = await readAndParseAlias(input)
//   expect(parsedAliases).toEqual(expectValue)
// })
