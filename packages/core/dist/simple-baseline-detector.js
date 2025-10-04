"use strict";
/**
 * Simplified Baseline Detector for demonstration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleBaselineDetector = void 0;
class SimpleBaselineDetector {
    constructor() {
        this.features = new Map();
        this.initializeFeatures();
    }
    initializeFeatures() {
        const mockFeatures = {
            'grid': {
                name: 'CSS Grid',
                description: 'CSS Grid Layout',
                group: 'css',
                baseline: {
                    baseline: 'widely',
                    baseline_high_date: '2017-03-14',
                    support: { chrome: '57', firefox: '52', safari: '10.1', edge: '16' }
                }
            },
            'subgrid': {
                name: 'CSS Subgrid',
                description: 'CSS Grid Subgrid',
                group: 'css',
                baseline: {
                    baseline: 'newly',
                    baseline_low_date: '2023-09-15',
                    support: { chrome: '117', firefox: '71', safari: '16' }
                }
            },
            'container-queries': {
                name: 'Container Queries',
                description: 'CSS Container Queries',
                group: 'css',
                baseline: {
                    baseline: 'newly',
                    baseline_low_date: '2023-02-14',
                    support: { chrome: '105', firefox: '110', safari: '16' }
                }
            },
            'word-break-auto-phrase': {
                name: 'word-break: auto-phrase',
                description: 'CSS word-break auto-phrase value',
                group: 'css',
                baseline: {
                    baseline: false,
                    support: { chrome: '119' }
                }
            },
            'has-selector': {
                name: ':has() selector',
                description: 'CSS :has() pseudo-class',
                group: 'css',
                baseline: {
                    baseline: 'newly',
                    baseline_low_date: '2022-12-13',
                    support: { chrome: '105', firefox: '103', safari: '15.4' }
                }
            }
        };
        Object.entries(mockFeatures).forEach(([id, feature]) => {
            this.features.set(id, {
                id,
                name: feature.name,
                description: feature.description,
                group: feature.group,
                baseline: feature.baseline
            });
        });
    }
    getBaselineStatus(featureId) {
        const feature = this.features.get(featureId);
        return feature?.baseline || null;
    }
    isBaselineSafe(featureId) {
        const status = this.getBaselineStatus(featureId);
        return status?.baseline === 'widely' || status?.baseline === 'newly';
    }
    getBaselineFeatures() {
        return Array.from(this.features.values());
    }
    getWidelyAvailableFeatures() {
        return Array.from(this.features.values()).filter(f => f.baseline.baseline === 'widely');
    }
    getNewlyAvailableFeatures() {
        return Array.from(this.features.values()).filter(f => f.baseline.baseline === 'newly');
    }
    searchFeatures(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.features.values()).filter(f => f.name.toLowerCase().includes(lowerQuery) ||
            f.description.toLowerCase().includes(lowerQuery));
    }
}
exports.SimpleBaselineDetector = SimpleBaselineDetector;
//# sourceMappingURL=simple-baseline-detector.js.map