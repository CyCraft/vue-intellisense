const { resolve } = require('path')
const { readdir } = require('fs').promises

async function listFilesNonRecursive(folderPath: string): Promise<string[]> {
  const dirents = await readdir(folderPath, { withFileTypes: true })
  const files = await Promise.all(
    dirents.flatMap((dirent: any) => {
      const res = resolve(folderPath, dirent.name)
      return dirent.isDirectory() ? [] : res
    })
  )
  const allFiles = Array.prototype.concat(...files)
  return allFiles
}

async function listFilesRecursively(folderPath: string): Promise<string[]> {
  const dirents = await readdir(folderPath, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent: any) => {
      const res = resolve(folderPath, dirent.name)
      return dirent.isDirectory() ? listFiles(res) : res
    })
  )
  const allFiles = Array.prototype.concat(...files)
  return allFiles
}

/**
 * @param {string} folderPath "resources/foo/goo"
 * @param {{
    regexFilter?: RegExp,
    resolvePaths?: boolean,
    recursive?: boolean,
  }} options
 * regexFilter: RegExp - eg. /\.txt/ for only .txt files
 *
 * resolvePaths: boolean - when true it will return the _full_ path from the file system's root. If false (default) it will return the relativePath based on the initial directory path passed
 *
 * recursive: boolean - when true it will return ALL paths recursively. If false (default) it will only return the paths from the folder
 * @return {Promise<string[]>}
 */
export async function listFiles(
  folderPath: string,
  options?: {
    regexFilter?: RegExp
    resolvePaths?: boolean
    recursive?: boolean
  }
): Promise<string[]> {
  const { regexFilter, resolvePaths, recursive } = options || {}
  if (folderPath.endsWith('/')) folderPath = folderPath.slice(0, -1)
  const parentDirFullPath = resolve(folderPath).split(folderPath)[0]
  let allFiles = recursive
    ? await listFilesRecursively(folderPath)
    : await listFilesNonRecursive(folderPath)
  if (regexFilter === undefined && !resolvePaths) return allFiles
  return allFiles.flatMap((filePath) => {
    if (!resolvePaths) filePath = filePath.replace(parentDirFullPath, '')
    if (regexFilter === undefined) return filePath
    return filePath.match(regexFilter) ? filePath : []
  })
}
