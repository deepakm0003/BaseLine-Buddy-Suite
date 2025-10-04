/**
 * Utility functions for Baseline Buddy Core
 */
/**
 * Format Baseline status for display
 */
export declare function formatBaselineStatus(baseline: string | false): string;
/**
 * Get browser support summary
 */
export declare function getBrowserSupportSummary(support: Record<string, string>): string;
/**
 * Calculate Baseline score
 */
export declare function calculateBaselineScore(issues: Array<{
    baseline: {
        baseline: string | false;
    };
}>): number;
/**
 * Generate report summary
 */
export declare function generateReportSummary(scanResult: any): string;
/**
 * Format file path for display
 */
export declare function formatFilePath(filePath: string, basePath?: string): string;
/**
 * Get file extension
 */
export declare function getFileExtension(filePath: string): string;
/**
 * Check if file should be scanned
 */
export declare function shouldScanFile(filePath: string, includePatterns?: string[], excludePatterns?: string[]): boolean;
/**
 * Simple glob pattern matching
 */
export declare function matchesPattern(filePath: string, pattern: string): boolean;
/**
 * Read file safely
 */
export declare function readFileSafely(filePath: string): string | null;
/**
 * Write file safely
 */
export declare function writeFileSafely(filePath: string, content: string): boolean;
/**
 * Ensure directory exists
 */
export declare function ensureDirectoryExists(dirPath: string): boolean;
/**
 * Get relative path
 */
export declare function getRelativePath(filePath: string, basePath: string): string;
/**
 * Normalize path
 */
export declare function normalizePath(filePath: string): string;
/**
 * Check if path is absolute
 */
export declare function isAbsolutePath(filePath: string): boolean;
/**
 * Resolve path
 */
export declare function resolvePath(...paths: string[]): string;
/**
 * Get directory name
 */
export declare function getDirname(filePath: string): string;
/**
 * Get basename
 */
export declare function getBasename(filePath: string, ext?: string): string;
/**
 * Format duration
 */
export declare function formatDuration(milliseconds: number): string;
/**
 * Format file size
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=utils.d.ts.map