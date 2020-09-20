export declare function vueFilePathToVeturJsonData(vueFilePath: string, veturFile: 'attributes' | 'tags'): Promise<Record<string, any>>;
export declare function generateVeturFiles(inputPath: string, outputPath: string, options?: {
    recursive?: boolean;
}): Promise<void>;
