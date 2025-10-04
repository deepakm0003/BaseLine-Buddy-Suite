/**
 * Simplified Feature Analyzer for demonstration
 */
export interface SimpleBaselineIssue {
    type: 'css' | 'javascript' | 'html';
    feature: string;
    property?: string;
    value?: string;
    baseline: any;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
    line?: number;
    column?: number;
    file?: string;
}
export interface SimpleScanResult {
    issues: SimpleBaselineIssue[];
    summary: {
        total: number;
        errors: number;
        warnings: number;
        info: number;
        baselineSafe: number;
        baselineNewly: number;
        baselineWidely: number;
    };
    files: {
        scanned: number;
        withIssues: number;
    };
}
export declare class SimpleFeatureAnalyzer {
    private detector;
    constructor();
    analyzeFile(filePath: string, content: string): Promise<SimpleBaselineIssue[]>;
    scanDirectory(dirPath: string): Promise<SimpleScanResult>;
    private getFilesToScan;
}
//# sourceMappingURL=simple-feature-analyzer.d.ts.map