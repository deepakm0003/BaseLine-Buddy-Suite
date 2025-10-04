/**
 * Simplified Baseline Detector for demonstration
 */
export interface SimpleBaselineStatus {
    baseline: 'limited' | 'newly' | 'widely' | false;
    baseline_low_date?: string;
    baseline_high_date?: string;
    support: {
        chrome?: string;
        firefox?: string;
        safari?: string;
        edge?: string;
    };
}
export interface SimpleFeatureInfo {
    id: string;
    name: string;
    description: string;
    group: string;
    baseline: SimpleBaselineStatus;
}
export declare class SimpleBaselineDetector {
    private features;
    constructor();
    private initializeFeatures;
    getBaselineStatus(featureId: string): SimpleBaselineStatus | null;
    isBaselineSafe(featureId: string): boolean;
    getBaselineFeatures(): SimpleFeatureInfo[];
    getWidelyAvailableFeatures(): SimpleFeatureInfo[];
    getNewlyAvailableFeatures(): SimpleFeatureInfo[];
    searchFeatures(query: string): SimpleFeatureInfo[];
}
//# sourceMappingURL=simple-baseline-detector.d.ts.map