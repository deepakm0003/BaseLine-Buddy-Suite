/**
 * Scanner for Baseline compliance checking
 */
import { WorkingScanOptions, WorkingScanResult } from '@baseline-buddy/core';
export declare class BaselineScanner {
    private analyzer;
    constructor();
    /**
     * Scan a directory for Baseline issues
     */
    scanDirectory(dirPath: string, options?: WorkingScanOptions): Promise<WorkingScanResult>;
    /**
     * Scan a single file for Baseline issues
     */
    scanFile(filePath: string, options?: WorkingScanOptions): Promise<WorkingScanResult>;
    /**
     * Get files to scan based on patterns
     */
    getFilesToScan(dirPath: string, options?: WorkingScanOptions): string[];
    /**
     * Walk directory recursively
     */
    private walkDirectory;
    /**
     * Check if path matches pattern
     */
    private matchesPattern;
}
//# sourceMappingURL=scanner.d.ts.map