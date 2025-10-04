"use strict";
/**
 * Baseline Detector - Core logic for detecting Baseline status of web features
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselineDetector = void 0;
// Mock data for demonstration - in real implementation, use web-features package
const mockFeatures = {
    'grid': {
        name: 'CSS Grid',
        description: 'CSS Grid Layout',
        group: 'css',
        status: { baseline: 'widely', baseline_high_date: '2017-03-14' },
        compat_features: ['css.properties.display.grid']
    },
    'subgrid': {
        name: 'CSS Subgrid',
        description: 'CSS Grid Subgrid',
        group: 'css',
        status: { baseline: 'newly', baseline_low_date: '2023-09-15' },
        compat_features: ['css.properties.grid-template-columns.subgrid']
    },
    'container-queries': {
        name: 'Container Queries',
        description: 'CSS Container Queries',
        group: 'css',
        status: { baseline: 'newly', baseline_low_date: '2023-02-14' },
        compat_features: ['css.at-rules.container']
    }
};
class BaselineDetector {
    constructor() {
        this.features = new Map();
        this.initializeFeatures();
    }
    initializeFeatures() {
        // Initialize features from mock data - in real implementation, use web-features package
        Object.entries(mockFeatures).forEach(([id, feature]) => {
            this.features.set(id, {
                id,
                name: feature.name,
                description: feature.description,
                group: feature.group,
                baseline: feature.status,
                compat_features: feature.compat_features || [],
                spec: feature.spec
            });
        });
    }
    /**
     * Get Baseline status for a specific feature
     */
    getBaselineStatus(featureId) {
        const feature = this.features.get(featureId);
        return feature?.baseline || null;
    }
    /**
     * Get Baseline status for a BCD key
     */
    async getBCDStatus(featureId, bcdKey) {
        try {
            // Mock implementation - in real implementation, use compute-baseline package
            const mockStatus = {
                baseline: 'widely',
                baseline_high_date: '2017-03-14',
                support: {
                    chrome: '57',
                    firefox: '52',
                    safari: '10.1',
                    edge: '16'
                }
            };
            return mockStatus;
        }
        catch (error) {
            console.warn(`Failed to get BCD status for ${bcdKey}:`, error);
            return null;
        }
    }
    /**
     * Check if a feature is Baseline safe
     */
    isBaselineSafe(featureId) {
        const status = this.getBaselineStatus(featureId);
        return status?.baseline === 'widely' || status?.baseline === 'newly';
    }
    /**
     * Check if a feature is Baseline newly available
     */
    isBaselineNewly(featureId) {
        const status = this.getBaselineStatus(featureId);
        return status?.baseline === 'newly';
    }
    /**
     * Check if a feature is Baseline widely available
     */
    isBaselineWidely(featureId) {
        const status = this.getBaselineStatus(featureId);
        return status?.baseline === 'widely';
    }
    /**
     * Get all features by group
     */
    getFeaturesByGroup(group) {
        return Array.from(this.features.values()).filter(f => f.group === group);
    }
    /**
     * Get all Baseline features
     */
    getBaselineFeatures() {
        return Array.from(this.features.values()).filter(f => f.baseline.baseline === 'newly' || f.baseline.baseline === 'widely');
    }
    /**
     * Get all widely available Baseline features
     */
    getWidelyAvailableFeatures() {
        return Array.from(this.features.values()).filter(f => f.baseline.baseline === 'widely');
    }
    /**
     * Get all newly available Baseline features
     */
    getNewlyAvailableFeatures() {
        return Array.from(this.features.values()).filter(f => f.baseline.baseline === 'newly');
    }
    /**
     * Search features by name or description
     */
    searchFeatures(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.features.values()).filter(f => f.name.toLowerCase().includes(lowerQuery) ||
            f.description.toLowerCase().includes(lowerQuery));
    }
    /**
     * Create a Baseline issue for a detected problem
     */
    createBaselineIssue(type, feature, baseline, options = {}) {
        const severity = this.getSeverity(baseline);
        const message = this.generateMessage(feature, baseline, options);
        const suggestion = this.generateSuggestion(feature, baseline, options);
        return {
            type,
            feature,
            property: options.property,
            value: options.value,
            baseline,
            severity,
            message,
            suggestion,
            line: options.line,
            column: options.column,
            file: options.file
        };
    }
    getSeverity(baseline) {
        if (baseline.baseline === false)
            return 'error';
        if (baseline.baseline === 'newly')
            return 'warning';
        return 'info';
    }
    generateMessage(feature, baseline, options) {
        const featureName = options.property ? `${options.property}${options.value ? `: ${options.value}` : ''}` : feature;
        switch (baseline.baseline) {
            case false:
                return `${featureName} is not Baseline. Limited browser support.`;
            case 'newly':
                return `${featureName} is Baseline Newly available. Use with caution.`;
            case 'widely':
                return `${featureName} is Baseline Widely available. Safe to use.`;
            default:
                return `${featureName} has unknown Baseline status.`;
        }
    }
    generateSuggestion(feature, baseline, options) {
        if (baseline.baseline === false) {
            return 'Consider using a fallback or alternative approach for better browser compatibility.';
        }
        if (baseline.baseline === 'newly') {
            return 'This feature is newly available. Consider adding a fallback for older browsers.';
        }
        return 'This feature is widely supported and safe to use.';
    }
}
exports.BaselineDetector = BaselineDetector;
//# sourceMappingURL=baseline-detector.js.map