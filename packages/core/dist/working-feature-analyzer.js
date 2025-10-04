"use strict";
/**
 * Working Feature Analyzer - Production ready implementation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingFeatureAnalyzer = void 0;
const working_baseline_detector_1 = require("./working-baseline-detector");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkingFeatureAnalyzer {
    constructor() {
        this.detector = new working_baseline_detector_1.WorkingBaselineDetector();
    }
    async analyzeFile(filePath, content, _options = {}) {
        const issues = [];
        const lines = content.split('\n');
        // Simple pattern matching for demonstration
        lines.forEach((line, lineIndex) => {
            // Check for CSS Grid
            if (line.includes('display: grid') || line.includes('display:grid')) {
                const status = this.detector.getBaselineStatus('grid');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', 'CSS Grid', status, {
                        property: 'display',
                        value: 'grid',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for CSS Subgrid
            if (line.includes('subgrid')) {
                const status = this.detector.getBaselineStatus('subgrid');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', 'CSS Subgrid', status, {
                        property: 'grid-template-columns',
                        value: 'subgrid',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for word-break: auto-phrase
            if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
                const status = this.detector.getBaselineStatus('word-break-auto-phrase');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', 'word-break: auto-phrase', status, {
                        property: 'word-break',
                        value: 'auto-phrase',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for :has() selector
            if (line.includes(':has(')) {
                const status = this.detector.getBaselineStatus('has-selector');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', ':has() selector', status, {
                        property: ':has()',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for container queries
            if (line.includes('@container')) {
                const status = this.detector.getBaselineStatus('container-queries');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', 'Container Queries', status, {
                        property: '@container',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for CSS Nesting
            if (line.includes('&') && line.includes('{')) {
                const status = this.detector.getBaselineStatus('css-nesting');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('css', 'CSS Nesting', status, {
                        property: 'nesting',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for HTML dialog element
            if (line.includes('<dialog') || line.includes('</dialog>')) {
                const status = this.detector.getBaselineStatus('dialog-element');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('html', 'HTML Dialog Element', status, {
                        property: 'dialog',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
            // Check for Array.toSorted
            if (line.includes('.toSorted(')) {
                const status = this.detector.getBaselineStatus('array-tosorted');
                if (status) {
                    issues.push(this.detector.createBaselineIssue('javascript', 'Array.prototype.toSorted', status, {
                        property: 'toSorted',
                        line: lineIndex + 1,
                        column: 1,
                        file: filePath
                    }));
                }
            }
        });
        return issues;
    }
    async scanDirectory(dirPath, options = {}) {
        const issues = [];
        let scannedFiles = 0;
        let filesWithIssues = 0;
        const files = this.getFilesToScan(dirPath, options);
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                const fileIssues = await this.analyzeFile(file, content, options);
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
    getFilesToScan(dirPath, options) {
        const files = [];
        // const _includePatterns = options.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html', '**/*.htm'];
        const excludePatterns = options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**', '**/out/**'];
        const scanDir = (currentPath) => {
            try {
                const items = fs.readdirSync(currentPath);
                for (const item of items) {
                    const itemPath = path.join(currentPath, item);
                    const stat = fs.statSync(itemPath);
                    if (stat.isDirectory()) {
                        // Skip excluded directories
                        if (!excludePatterns.some(pattern => itemPath.includes(pattern.replace('**/', '')))) {
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
exports.WorkingFeatureAnalyzer = WorkingFeatureAnalyzer;
//# sourceMappingURL=working-feature-analyzer.js.map