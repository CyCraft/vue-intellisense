declare function readAndParseAlias(rawAliases: string[]): Record<string, string>;
/**
 *  Make console.warn throw, so that we can check warning aliase config not correct
 */
declare function handleWarningMissingAlias(): void;
export { handleWarningMissingAlias, readAndParseAlias };
