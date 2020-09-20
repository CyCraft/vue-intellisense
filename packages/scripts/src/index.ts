import { isPlainObject } from 'is-what'
import { merge } from 'merge-anything'
import { parse } from 'vue-docgen-api'
import { listFiles } from './listFiles'
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

async function vueFilePathsToVeturJsonData(
  inputPaths: string[],
  veturFile: 'attributes' | 'tags'
): Promise<Record<string, any>> {
  const objects = await Promise.all(
    inputPaths.map((path) => vueFilePathToVeturJsonData(path, veturFile))
  )
  if (!objects.length) throw '[vue-intellisense] missing <input paths>'
  return merge(objects[0], ...objects.slice(1))
}

async function writeVeturFiles(
  outputPath: string,
  attributes: Record<string, any>,
  tags: Record<string, any>
): Promise<void> {
  const _out = outputPath.endsWith('/') ? outputPath : outputPath + '/'
  fs.mkdirSync(_out, { recursive: true })
  fs.writeFileSync(_out + 'attributes.json', JSON.stringify(attributes, undefined, 2))
  fs.writeFileSync(_out + 'tags.json', JSON.stringify(tags, undefined, 2))
}

export async function generateVeturFiles(
  inputPath: string,
  outputPath: string,
  options?: { recursive?: boolean }
): Promise<void> {
  const { recursive } = options || {}
  const inputIsFile = ['.vue', '.jsx', '.tsx'].some((fileType) => inputPath.endsWith(fileType))
  const allFiles = inputIsFile
    ? [inputPath]
    : await listFiles(inputPath, { regexFilter: /\.vue|\.jsx|\.tsx/, recursive })
  const attributes = await vueFilePathsToVeturJsonData(allFiles, 'attributes')
  const tags = await vueFilePathsToVeturJsonData(allFiles, 'tags')
  await writeVeturFiles(outputPath, attributes, tags)
}
