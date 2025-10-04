/**
 * Feature Analyzer - Analyzes code for Baseline compliance
 */
import { BaselineIssue, ScanResult, ScanOptions } from './types';
export declare class FeatureAnalyzer {
    private detector;
    constructor();
    /**
     * Scan a directory for Baseline issues
     */
    scanDirectory(dirPath: string, options?: ScanOptions): Promise<ScanResult>;
    /**
     * Analyze a single file for Baseline issues
     */
    analyzeFile(filePath: string, content: string, options?: ScanOptions): Promise<BaselineIssue[]>;
    /**
     * Analyze CSS for Baseline issues
     */
    private analyzeCSS;
    /**
     * Analyze JavaScript for Baseline issues
     */
    private analyzeJavaScript;
    /**
     * Analyze HTML for Baseline issues
     */
    private analyzeHTML;
    /**
     * Get files to scan based on options
     */
    private getFilesToScan;
    /**
     * Walk directory recursively
     */
    private walkDirectory;
    /**
     * Check if path matches pattern
     */
    private matchesPattern;
    /**
     * Walk CSS AST
     */
    private walkCSSAST;
    /**
     * Walk JavaScript AST
     */
    private walkJSAST;
    /**
     * Walk HTML DOM
     */
    private walkHTMLDOM;
    /**
     * Extract value from CSS value node
     */
    private extractValue;
    /**
     * Extract API name from JavaScript node
     */
    private extractAPIName;
    /**
     * Create scan result summary
     */
    private createScanResult;
}
//# sourceMappingURL=feature-analyzer.d.ts.map