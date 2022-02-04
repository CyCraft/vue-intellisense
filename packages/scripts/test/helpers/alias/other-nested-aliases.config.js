import path from 'path'
import fs from 'fs'

const aliases = {
  '@': '.',
  '@src': './src',
  '@models': './src/models',
}

module.exports = {
  config: {
    alias: {},
  },
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.config.alias[alias] = resolveSrc(aliasTo)
}

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
