const path = require('path')
const fs = require('fs')

const aliases = {
  '@': '.',
  '@src': './src',
  '@components': './src/components',
}

module.exports = {
  webpack: {
    resole: {
      alias: {},
    },
  },
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack.resole.alias[alias] = resolveSrc(aliasTo)
}

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
