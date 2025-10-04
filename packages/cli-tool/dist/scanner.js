"use strict";
/**
 * Scanner for Baseline compliance checking
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
exports.BaselineScanner = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const core_1 = require("@baseline-buddy/core");
class BaselineScanner {
    constructor() {
        this.analyzer = new core_1.WorkingFeatureAnalyzer();
    }
    /**
     * Scan a directory for Baseline issues
     */
    async scanDirectory(dirPath, options = {}) {
        // Validate path
        if (!fs.existsSync(dirPath)) {
            throw new Error(`Path does not exist: ${dirPath}`);
        }
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (!isDirectory) {
            throw new Error(`Path is not a directory: ${dirPath}`);
        }
        // Scan for issues
        return await this.analyzer.scanDirectory(dirPath, options);
    }
    /**
     * Scan a single file for Baseline issues
     */
    async scanFile(filePath, options = {}) {
        // Validate path
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        const isFile = fs.statSync(filePath).isFile();
        if (!isFile) {
            throw new Error(`Path is not a file: ${filePath}`);
        }
        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');
        // Analyze file
        const issues = await this.analyzer.analyzeFile(filePath, content, options);
        // Create scan result
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
                scanned: 1,
                withIssues: issues.length > 0 ? 1 : 0
            }
        };
    }
    /**
     * Get files to scan based on patterns
     */
    getFilesToScan(dirPath, options = {}) {
        const files = [];
        const includePatterns = options.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html'];
        const excludePatterns = options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**'];
        this.walkDirectory(dirPath, (filePath) => {
            const relativePath = path.relative(dirPath, filePath);
            // Check include patterns
            const shouldInclude = includePatterns.some((pattern) => this.matchesPattern(relativePath, pattern));
            // Check exclude patterns
            const shouldExclude = excludePatterns.some((pattern) => this.matchesPattern(relativePath, pattern));
            if (shouldInclude && !shouldExclude) {
                files.push(filePath);
            }
        });
        return files;
    }
    /**
     * Walk directory recursively
     */
    walkDirectory(dirPath, callback) {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                this.walkDirectory(itemPath, callback);
            }
            else if (stat.isFile()) {
                callback(itemPath);
            }
        }
    }
    /**
     * Check if path matches pattern
     */
    matchesPattern(filePath, pattern) {
        // Simple glob pattern matching
        const regex = new RegExp(pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\./g, '\\.'));
        return regex.test(filePath);
    }
}
exports.BaselineScanner = BaselineScanner;
//# sourceMappingURL=scanner.js.map