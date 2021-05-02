/**
 * @param {string} folderPath "resources/foo/goo"
 * @param {{
 *   regexFilter?: RegExp,
 *   resolvePaths?: boolean,
 *   recursive?: boolean,
 * }} options
 * regexFilter: RegExp - eg. /\.txt/ for only .txt files
 *
 * resolvePaths: boolean - when true it will return the _full_ path from the file system's root. If false (default) it will return the relativePath based on the initial directory path passed
 *
 * recursive: boolean - when true it will return ALL paths recursively. If false (default) it will only return the paths from the folder
 * @return {Promise<string[]>}
 */
export declare function listFiles(folderPath: string, options?: {
    regexFilter?: RegExp;
    resolvePaths?: boolean;
    recursive?: boolean;
}): Promise<string[]>;
