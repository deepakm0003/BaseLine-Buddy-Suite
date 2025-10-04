/**
 * Type definitions for Baseline Buddy Core
 */
export interface BaselineStatus {
    baseline: 'limited' | 'newly' | 'widely' | false;
    baseline_low_date?: string;
    baseline_high_date?: string;
    support: {
        chrome?: string;
        chrome_android?: string;
        edge?: string;
        firefox?: string;
        firefox_android?: string;
        safari?: string;
        safari_ios?: string;
    };
}
export interface FeatureInfo {
    id: string;
    name: string;
    description: string;
    group: string;
    baseline: BaselineStatus;
    compat_features: string[];
    spec?: string;
}
export interface BaselineIssue {
    type: 'css' | 'javascript' | 'html';
    feature: string;
    property?: string;
    value?: string;
    baseline: BaselineStatus;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
    autoFix?: string;
    line?: number;
    column?: number;
    file?: string;
}
export interface AISuggestion {
    explanation: string;
    alternatives: string[];
    autoFix?: string;
    learningSnippet?: string;
    confidence: number;
}
export interface ScanResult {
    issues: BaselineIssue[];
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
export interface ScanOptions {
    includePatterns?: string[];
    excludePatterns?: string[];
    baselineLevel?: 'limited' | 'newly' | 'widely';
    enableAI?: boolean;
    outputFormat?: 'json' | 'html' | 'text';
    verbose?: boolean;
}
//# sourceMappingURL=types.d.ts.map