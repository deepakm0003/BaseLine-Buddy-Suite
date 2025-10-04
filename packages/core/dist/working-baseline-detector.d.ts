/**
 * Working Baseline Detector - Production ready implementation
 */
export interface WorkingBaselineStatus {
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
export interface WorkingFeatureInfo {
    id: string;
    name: string;
    description: string;
    group: string;
    baseline: WorkingBaselineStatus;
    compat_features: string[];
    spec?: string;
}
export interface WorkingBaselineIssue {
    type: 'css' | 'javascript' | 'html';
    feature: string;
    property?: string;
    value?: string;
    baseline: WorkingBaselineStatus;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
    autoFix?: string;
    line?: number;
    column?: number;
    file?: string;
}
export interface WorkingScanResult {
    issues: WorkingBaselineIssue[];
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
export interface WorkingScanOptions {
    includePatterns?: string[];
    excludePatterns?: string[];
    baselineLevel?: 'limited' | 'newly' | 'widely';
    enableAI?: boolean;
    outputFormat?: 'json' | 'html' | 'text';
    verbose?: boolean;
}
export declare class WorkingBaselineDetector {
    private features;
    constructor();
    private initializeFeatures;
    getBaselineStatus(featureId: string): WorkingBaselineStatus | null;
    getBCDStatus(_featureId: string, bcdKey: string): Promise<WorkingBaselineStatus | null>;
    isBaselineSafe(featureId: string): boolean;
    isBaselineNewly(featureId: string): boolean;
    isBaselineWidely(featureId: string): boolean;
    getFeaturesByGroup(group: string): WorkingFeatureInfo[];
    getBaselineFeatures(): WorkingFeatureInfo[];
    getWidelyAvailableFeatures(): WorkingFeatureInfo[];
    getNewlyAvailableFeatures(): WorkingFeatureInfo[];
    searchFeatures(query: string): WorkingFeatureInfo[];
    createBaselineIssue(type: 'css' | 'javascript' | 'html', feature: string, baseline: WorkingBaselineStatus, options?: {
        property?: string;
        value?: string;
        line?: number;
        column?: number;
        file?: string;
    }): WorkingBaselineIssue;
    private getSeverity;
    private generateMessage;
    private generateSuggestion;
    /**
     * Get detailed information about a specific feature
     */
    getFeatureInfo(featureId: string): Promise<any>;
}
//# sourceMappingURL=working-baseline-detector.d.ts.map