/**
 * Working Feature Analyzer - Production ready implementation
 */
import { WorkingBaselineIssue, WorkingScanResult, WorkingScanOptions } from './working-baseline-detector';
export declare class WorkingFeatureAnalyzer {
    private detector;
    constructor();
    analyzeFile(filePath: string, content: string, _options?: WorkingScanOptions): Promise<WorkingBaselineIssue[]>;
    scanDirectory(dirPath: string, options?: WorkingScanOptions): Promise<WorkingScanResult>;
    private getFilesToScan;
}
//# sourceMappingURL=working-feature-analyzer.d.ts.map