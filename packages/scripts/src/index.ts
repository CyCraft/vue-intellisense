import { isPlainObject } from 'is-what'
import { parse } from 'vue-docgen-api'
import { vueDocgenToVetur } from './vueDocgenToVetur'
const fs = require('fs')

export async function vueFilePathToVeturJsonData(
  vueFilePath: string,
  veturFile: 'attributes' | 'tags'
): Promise<Record<string, any>> {
  const vueDocgen = await parse(vueFilePath)
  if (!isPlainObject(vueDocgen)) return {}
  const jsonData = vueDocgenToVetur(vueDocgen, veturFile)
  return jsonData
}

export async function generateVeturFiles(inputPath: string, outputPath: string) {
  const attributes = await vueFilePathToVeturJsonData(inputPath, 'attributes')
  const tags = await vueFilePathToVeturJsonData(inputPath, 'tags')
  const _out = outputPath.endsWith('/') ? outputPath : outputPath + '/'
  fs.mkdirSync(_out, { recursive: true })
  fs.writeFileSync(_out + 'attributes.json', JSON.stringify(attributes, undefined, 2))
  fs.writeFileSync(_out + 'tags.json', JSON.stringify(tags, undefined, 2))
}
