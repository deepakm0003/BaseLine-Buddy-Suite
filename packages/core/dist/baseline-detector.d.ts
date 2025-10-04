/**
 * Baseline Detector - Core logic for detecting Baseline status of web features
 */
import { FeatureInfo, BaselineStatus, BaselineIssue } from './types';
export declare class BaselineDetector {
    private features;
    constructor();
    private initializeFeatures;
    /**
     * Get Baseline status for a specific feature
     */
    getBaselineStatus(featureId: string): BaselineStatus | null;
    /**
     * Get Baseline status for a BCD key
     */
    getBCDStatus(featureId: string, bcdKey: string): Promise<BaselineStatus | null>;
    /**
     * Check if a feature is Baseline safe
     */
    isBaselineSafe(featureId: string): boolean;
    /**
     * Check if a feature is Baseline newly available
     */
    isBaselineNewly(featureId: string): boolean;
    /**
     * Check if a feature is Baseline widely available
     */
    isBaselineWidely(featureId: string): boolean;
    /**
     * Get all features by group
     */
    getFeaturesByGroup(group: string): FeatureInfo[];
    /**
     * Get all Baseline features
     */
    getBaselineFeatures(): FeatureInfo[];
    /**
     * Get all widely available Baseline features
     */
    getWidelyAvailableFeatures(): FeatureInfo[];
    /**
     * Get all newly available Baseline features
     */
    getNewlyAvailableFeatures(): FeatureInfo[];
    /**
     * Search features by name or description
     */
    searchFeatures(query: string): FeatureInfo[];
    /**
     * Create a Baseline issue for a detected problem
     */
    createBaselineIssue(type: 'css' | 'javascript' | 'html', feature: string, baseline: BaselineStatus, options?: {
        property?: string;
        value?: string;
        line?: number;
        column?: number;
        file?: string;
    }): BaselineIssue;
    private getSeverity;
    private generateMessage;
    private generateSuggestion;
}
//# sourceMappingURL=baseline-detector.d.ts.map