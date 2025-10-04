"use strict";
/**
 * Simplified Feature Analyzer for demonstration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleFeatureAnalyzer = void 0;
const simple_baseline_detector_1 = require("./simple-baseline-detector");
class SimpleFeatureAnalyzer {
    constructor() {
        this.detector = new simple_baseline_detector_1.SimpleBaselineDetector();
    }
    async analyzeFile(filePath, content) {
        const issues = [];
        const lines = content.split('\n');
        // Simple pattern matching for demonstration
        lines.forEach((line, lineIndex) => {
            // Check for CSS Grid
            if (line.includes('display: grid') || line.includes('display:grid')) {
                const status = this.detector.getBaselineStatus('grid');
                if (status) {
                    issues.push({
                        type: 'css',
                        feature: 'CSS Grid',
                        baseline: status,
                        severity: 'info',
                        message: 'CSS Grid is Baseline Widely available. Safe to use.',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    });
                }
            }
            // Check for CSS Subgrid
            if (line.includes('subgrid')) {
                const status = this.detector.getBaselineStatus('subgrid');
                if (status) {
                    issues.push({
                        type: 'css',
                        feature: 'CSS Subgrid',
                        baseline: status,
                        severity: 'warning',
                        message: 'CSS Subgrid is Baseline Newly available. Use with caution.',
                        suggestion: 'Consider adding a fallback for older browsers.',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    });
                }
            }
            // Check for word-break: auto-phrase
            if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
                const status = this.detector.getBaselineStatus('word-break-auto-phrase');
                if (status) {
                    issues.push({
                        type: 'css',
                        feature: 'word-break: auto-phrase',
                        baseline: status,
                        severity: 'error',
                        message: 'word-break: auto-phrase is not Baseline. Limited browser support.',
                        suggestion: 'Use word-break: break-word for better compatibility.',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    });
                }
            }
            // Check for :has() selector
            if (line.includes(':has(')) {
                const status = this.detector.getBaselineStatus('has-selector');
                if (status) {
                    issues.push({
                        type: 'css',
                        feature: ':has() selector',
                        baseline: status,
                        severity: 'warning',
                        message: ':has() selector is Baseline Newly available. Use with caution.',
                        suggestion: 'Consider using JavaScript querySelector as a fallback.',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    });
                }
            }
            // Check for container queries
            if (line.includes('@container')) {
                const status = this.detector.getBaselineStatus('container-queries');
                if (status) {
                    issues.push({
                        type: 'css',
                        feature: 'Container Queries',
                        baseline: status,
                        severity: 'warning',
                        message: 'Container Queries are Baseline Newly available. Use with caution.',
                        suggestion: 'Consider using media queries as a fallback.',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    });
                }
            }
        });
        return issues;
    }
    async scanDirectory(dirPath) {
        const fs = require('fs');
        const path = require('path');
        const issues = [];
        let scannedFiles = 0;
        let filesWithIssues = 0;
        const files = this.getFilesToScan(dirPath);
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                const fileIssues = await this.analyzeFile(file, content);
                if (fileIssues.length > 0) {
                    issues.push(...fileIssues);
                    filesWithIssues++;
                }
                scannedFiles++;
            }
            catch (error) {
                console.warn(`Failed to analyze ${file}:`, error);
            }
        }
        return {
            issues,
            summary: {
                total: issues.length,
                errors: issues.filter(i => i.severity === 'error').length,
                warnings: issues.filter(i => i.severity === 'warning').length,
                info: issues.filter(i => i.severity === 'info').length,
                baselineSafe: issues.filter(i => i.baseline.baseline === 'widely').length,
                baselineNewly: issues.filter(i => i.baseline.baseline === 'newly').length,
                baselineWidely: issues.filter(i => i.baseline.baseline === 'widely').length
            },
            files: {
                scanned: scannedFiles,
                withIssues: filesWithIssues
            }
        };
    }
    getFilesToScan(dirPath) {
        const fs = require('fs');
        const path = require('path');
        const files = [];
        const scanDir = (currentPath) => {
            try {
                const items = fs.readdirSync(currentPath);
                for (const item of items) {
                    const itemPath = path.join(currentPath, item);
                    const stat = fs.statSync(itemPath);
                    if (stat.isDirectory()) {
                        // Skip node_modules, dist, build directories
                        if (!['node_modules', 'dist', 'build', 'out'].includes(item)) {
                            scanDir(itemPath);
                        }
                    }
                    else if (stat.isFile()) {
                        const ext = path.extname(item).toLowerCase();
                        if (['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm'].includes(ext)) {
                            files.push(itemPath);
                        }
                    }
                }
            }
            catch (error) {
                console.warn(`Failed to scan directory ${currentPath}:`, error);
            }
        };
        scanDir(dirPath);
        return files;
    }
}
exports.SimpleFeatureAnalyzer = SimpleFeatureAnalyzer;
//# sourceMappingURL=simple-feature-analyzer.js.map