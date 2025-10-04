"use strict";
/**
 * Utility functions for Baseline Buddy Core
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
exports.formatBaselineStatus = formatBaselineStatus;
exports.getBrowserSupportSummary = getBrowserSupportSummary;
exports.calculateBaselineScore = calculateBaselineScore;
exports.generateReportSummary = generateReportSummary;
exports.formatFilePath = formatFilePath;
exports.getFileExtension = getFileExtension;
exports.shouldScanFile = shouldScanFile;
exports.matchesPattern = matchesPattern;
exports.readFileSafely = readFileSafely;
exports.writeFileSafely = writeFileSafely;
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.getRelativePath = getRelativePath;
exports.normalizePath = normalizePath;
exports.isAbsolutePath = isAbsolutePath;
exports.resolvePath = resolvePath;
exports.getDirname = getDirname;
exports.getBasename = getBasename;
exports.formatDuration = formatDuration;
exports.formatFileSize = formatFileSize;
exports.debounce = debounce;
exports.throttle = throttle;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Format Baseline status for display
 */
function formatBaselineStatus(baseline) {
    switch (baseline) {
        case 'widely':
            return 'Baseline Widely Available';
        case 'newly':
            return 'Baseline Newly Available';
        case false:
            return 'Limited Availability';
        default:
            return 'Unknown Status';
    }
}
/**
 * Get browser support summary
 */
function getBrowserSupportSummary(support) {
    const browsers = Object.entries(support)
        .map(([browser, version]) => `${browser} ${version}+`)
        .join(', ');
    return `Supported in: ${browsers}`;
}
/**
 * Calculate Baseline score
 */
function calculateBaselineScore(issues) {
    if (issues.length === 0)
        return 100;
    const widelySupported = issues.filter(issue => issue.baseline.baseline === 'widely').length;
    const newlySupported = issues.filter(issue => issue.baseline.baseline === 'newly').length;
    const limitedSupport = issues.filter(issue => issue.baseline.baseline === false).length;
    const score = ((widelySupported * 1.0) + (newlySupported * 0.7) + (limitedSupport * 0.0)) / issues.length * 100;
    return Math.round(score);
}
/**
 * Generate report summary
 */
function generateReportSummary(scanResult) {
    const { summary, files } = scanResult;
    return `
📊 Baseline Compliance Report
============================

📁 Files Scanned: ${files.scanned}
⚠️  Files with Issues: ${files.withIssues}

🔍 Issues Found: ${summary.total}
  ❌ Errors: ${summary.errors}
  ⚠️  Warnings: ${summary.warnings}
  ℹ️  Info: ${summary.info}

📈 Baseline Status:
  ✅ Widely Available: ${summary.baselineWidely}
  🆕 Newly Available: ${summary.baselineNewly}
  ❌ Limited Support: ${summary.total - summary.baselineWidely - summary.baselineNewly}

🎯 Baseline Score: ${calculateBaselineScore(scanResult.issues)}%
  `.trim();
}
/**
 * Format file path for display
 */
function formatFilePath(filePath, basePath) {
    if (basePath && filePath.startsWith(basePath)) {
        return path.relative(basePath, filePath);
    }
    return filePath;
}
/**
 * Get file extension
 */
function getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase();
}
/**
 * Check if file should be scanned
 */
function shouldScanFile(filePath, includePatterns = [], excludePatterns = []) {
    const ext = getFileExtension(filePath);
    const supportedExtensions = ['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm'];
    if (!supportedExtensions.includes(ext)) {
        return false;
    }
    // Check include patterns
    if (includePatterns.length > 0) {
        const matchesInclude = includePatterns.some(pattern => matchesPattern(filePath, pattern));
        if (!matchesInclude)
            return false;
    }
    // Check exclude patterns
    if (excludePatterns.length > 0) {
        const matchesExclude = excludePatterns.some(pattern => matchesPattern(filePath, pattern));
        if (matchesExclude)
            return false;
    }
    return true;
}
/**
 * Simple glob pattern matching
 */
function matchesPattern(filePath, pattern) {
    const regex = new RegExp(pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\./g, '\\.'));
    return regex.test(filePath);
}
/**
 * Read file safely
 */
function readFileSafely(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch (error) {
        console.warn(`Failed to read file ${filePath}:`, error);
        return null;
    }
}
/**
 * Write file safely
 */
function writeFileSafely(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    }
    catch (error) {
        console.warn(`Failed to write file ${filePath}:`, error);
        return false;
    }
}
/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        return true;
    }
    catch (error) {
        console.warn(`Failed to create directory ${dirPath}:`, error);
        return false;
    }
}
/**
 * Get relative path
 */
function getRelativePath(filePath, basePath) {
    return path.relative(basePath, filePath);
}
/**
 * Normalize path
 */
function normalizePath(filePath) {
    return path.normalize(filePath);
}
/**
 * Check if path is absolute
 */
function isAbsolutePath(filePath) {
    return path.isAbsolute(filePath);
}
/**
 * Resolve path
 */
function resolvePath(...paths) {
    return path.resolve(...paths);
}
/**
 * Get directory name
 */
function getDirname(filePath) {
    return path.dirname(filePath);
}
/**
 * Get basename
 */
function getBasename(filePath, ext) {
    return path.basename(filePath, ext);
}
/**
 * Format duration
 */
function formatDuration(milliseconds) {
    if (milliseconds < 1000) {
        return `${milliseconds}ms`;
    }
    else if (milliseconds < 60000) {
        return `${(milliseconds / 1000).toFixed(1)}s`;
    }
    else {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
}
/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
}
/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
//# sourceMappingURL=utils.js.map