const { resolve } = require('path')
const { readdir } = require('fs').promises

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
 * @param {RegExp} regexFilter eg. /\.txt/
 * @param {boolean} resolvePaths when true it will return the _full_ path from the file system's root. If false (default) it will return the relativePath based on the initial directory path passed.
 * @return {Promise<string[]>}
 */
export async function listFiles(
  folderPath: string,
  regexFilter?: RegExp,
  resolvePaths = false
): Promise<string[]> {
  if (folderPath.endsWith('/')) folderPath = folderPath.slice(0, -1)
  const parentDirFullPath = resolve(folderPath).split(folderPath)[0]
  let allFiles = await listFilesRecursively(folderPath)
  if (regexFilter === undefined && !resolvePaths) return allFiles
  return allFiles.flatMap((filePath) => {
    if (!resolvePaths) filePath = filePath.replace(parentDirFullPath, '')
    if (regexFilter === undefined) return filePath
    return filePath.match(regexFilter) ? filePath : []
  })
}
