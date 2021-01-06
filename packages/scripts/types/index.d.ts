export declare function vueFilePathToVeturJsonData(vueFilePath: string, veturFile: 'attributes' | 'tags', options?: {
    alias?: {
        [alias in string]: string;
    };
    [key: string]: any;
}): Promise<Record<string, any>>;
export declare function generateVeturFiles(inputPath: string, outputPath: string, options?: {
    recursive?: boolean;
    alias?: {
        [alias in string]: string;
    };
}): Promise<void>;
