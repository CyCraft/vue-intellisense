/**
 * @param {string} folderPath "resources/foo/goo"
 * @param {RegExp} regexFilter eg. /\.txt/
 * @param {boolean} resolvePaths when true it will return the _full_ path from the file system's root. If false (default) it will return the relativePath based on the initial directory path passed.
 * @return {Promise<string[]>}
 */
export declare function listFiles(folderPath: string, regexFilter?: RegExp, resolvePaths?: boolean): Promise<string[]>;
