/**
 * Formatters for different output formats
 */
import { WorkingScanResult } from '@baseline-buddy/core';
export declare class Formatter {
    /**
     * Format results as JSON
     */
    static formatJSON(result: WorkingScanResult, outputFile?: string): Promise<void>;
    /**
     * Format results as HTML
     */
    static formatHTML(result: WorkingScanResult, outputFile?: string): Promise<void>;
    /**
     * Format results as text
     */
    static formatText(result: WorkingScanResult, options?: any): void;
    /**
     * Format Baseline status
     */
    private static formatBaselineStatus;
    /**
     * Get severity icon
     */
    private static getSeverityIcon;
    /**
     * Generate HTML report
     */
    private static generateHTMLReport;
}
//# sourceMappingURL=formatters.d.ts.map