"use strict";
/**
 * Feature Analyzer - Analyzes code for Baseline compliance
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
exports.FeatureAnalyzer = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const css_tree_1 = require("css-tree");
const acorn_1 = require("acorn");
const htmlparser2_1 = require("htmlparser2");
const baseline_detector_1 = require("./baseline-detector");
class FeatureAnalyzer {
    constructor() {
        this.detector = new baseline_detector_1.BaselineDetector();
    }
    /**
     * Scan a directory for Baseline issues
     */
    async scanDirectory(dirPath, options = {}) {
        const issues = [];
        const files = this.getFilesToScan(dirPath, options);
        let scannedFiles = 0;
        let filesWithIssues = 0;
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
        return this.createScanResult(issues, scannedFiles, filesWithIssues);
    }
    /**
     * Analyze a single file for Baseline issues
     */
    async analyzeFile(filePath, content, options = {}) {
        const issues = [];
        const ext = path.extname(filePath).toLowerCase();
        try {
            if (ext === '.css') {
                issues.push(...await this.analyzeCSS(content, filePath));
            }
            else if (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') {
                issues.push(...await this.analyzeJavaScript(content, filePath));
            }
            else if (ext === '.html' || ext === '.htm') {
                issues.push(...await this.analyzeHTML(content, filePath));
            }
        }
        catch (error) {
            console.warn(`Failed to parse ${filePath}:`, error);
        }
        return issues;
    }
    /**
     * Analyze CSS for Baseline issues
     */
    async analyzeCSS(content, filePath) {
        const issues = [];
        try {
            const ast = (0, css_tree_1.parse)(content);
            // Walk through CSS AST to find properties and values
            this.walkCSSAST(ast, (node) => {
                if (node.type === 'Declaration') {
                    const property = node.property;
                    const value = this.extractValue(node.value);
                    // Check property baseline status
                    const bcdKey = `css.properties.${property}`;
                    const status = await this.detector.getBCDStatus('css', bcdKey);
                    if (status && !this.detector.isBaselineSafe('css')) {
                        issues.push(this.detector.createBaselineIssue('css', property, status, {
                            property,
                            value,
                            line: node.loc?.start.line,
                            column: node.loc?.start.column,
                            file: filePath
                        }));
                    }
                    // Check specific property-value combinations
                    if (value) {
                        const valueBcdKey = `css.properties.${property}.${value}`;
                        const valueStatus = await this.detector.getBCDStatus('css', valueBcdKey);
                        if (valueStatus && !this.detector.isBaselineSafe('css')) {
                            issues.push(this.detector.createBaselineIssue('css', `${property}: ${value}`, valueStatus, {
                                property,
                                value,
                                line: node.loc?.start.line,
                                column: node.loc?.start.column,
                                file: filePath
                            }));
                        }
                    }
                }
            });
        }
        catch (error) {
            console.warn(`Failed to parse CSS in ${filePath}:`, error);
        }
        return issues;
    }
    /**
     * Analyze JavaScript for Baseline issues
     */
    async analyzeJavaScript(content, filePath) {
        const issues = [];
        try {
            const ast = (0, acorn_1.parse)(content, { ecmaVersion: 2023, sourceType: 'module' });
            // Walk through JS AST to find API usage
            this.walkJSAST(ast, (node) => {
                if (node.type === 'CallExpression' || node.type === 'MemberExpression') {
                    const apiName = this.extractAPIName(node);
                    if (apiName) {
                        // Check if this is a known web API
                        const status = this.detector.getBaselineStatus(apiName);
                        if (status && !this.detector.isBaselineSafe(apiName)) {
                            issues.push(this.detector.createBaselineIssue('javascript', apiName, status, {
                                line: node.loc?.start.line,
                                column: node.loc?.start.column,
                                file: filePath
                            }));
                        }
                    }
                }
            });
        }
        catch (error) {
            console.warn(`Failed to parse JavaScript in ${filePath}:`, error);
        }
        return issues;
    }
    /**
     * Analyze HTML for Baseline issues
     */
    async analyzeHTML(content, filePath) {
        const issues = [];
        try {
            const dom = (0, htmlparser2_1.parse)(content, { xmlMode: false });
            // Walk through HTML DOM to find elements and attributes
            this.walkHTMLDOM(dom, (element) => {
                if (element.type === 'tag') {
                    const tagName = element.name;
                    const status = this.detector.getBaselineStatus(tagName);
                    if (status && !this.detector.isBaselineSafe(tagName)) {
                        issues.push(this.detector.createBaselineIssue('html', tagName, status, {
                            line: element.loc?.start.line,
                            column: element.loc?.start.column,
                            file: filePath
                        }));
                    }
                    // Check attributes
                    if (element.attribs) {
                        for (const [attrName, attrValue] of Object.entries(element.attribs)) {
                            const attrStatus = this.detector.getBaselineStatus(`${tagName}.${attrName}`);
                            if (attrStatus && !this.detector.isBaselineSafe(`${tagName}.${attrName}`)) {
                                issues.push(this.detector.createBaselineIssue('html', `${tagName}.${attrName}`, attrStatus, {
                                    property: attrName,
                                    value: attrValue,
                                    line: element.loc?.start.line,
                                    column: element.loc?.start.column,
                                    file: filePath
                                }));
                            }
                        }
                    }
                }
            });
        }
        catch (error) {
            console.warn(`Failed to parse HTML in ${filePath}:`, error);
        }
        return issues;
    }
    /**
     * Get files to scan based on options
     */
    getFilesToScan(dirPath, options) {
        const files = [];
        const includePatterns = options.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html'];
        const excludePatterns = options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**'];
        this.walkDirectory(dirPath, (filePath) => {
            const relativePath = path.relative(dirPath, filePath);
            // Check include patterns
            const shouldInclude = includePatterns.some(pattern => this.matchesPattern(relativePath, pattern));
            // Check exclude patterns
            const shouldExclude = excludePatterns.some(pattern => this.matchesPattern(relativePath, pattern));
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
    matchesPattern(path, pattern) {
        // Simple glob pattern matching
        const regex = new RegExp(pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\./g, '\\.'));
        return regex.test(path);
    }
    /**
     * Walk CSS AST
     */
    walkCSSAST(node, callback) {
        callback(node);
        if (node.children) {
            for (const child of node.children) {
                this.walkCSSAST(child, callback);
            }
        }
    }
    /**
     * Walk JavaScript AST
     */
    walkJSAST(node, callback) {
        callback(node);
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    for (const child of node[key]) {
                        if (child && typeof child === 'object' && child.type) {
                            this.walkJSAST(child, callback);
                        }
                    }
                }
                else if (node[key].type) {
                    this.walkJSAST(node[key], callback);
                }
            }
        }
    }
    /**
     * Walk HTML DOM
     */
    walkHTMLDOM(node, callback) {
        callback(node);
        if (node.children) {
            for (const child of node.children) {
                this.walkHTMLDOM(child, callback);
            }
        }
    }
    /**
     * Extract value from CSS value node
     */
    extractValue(valueNode) {
        if (!valueNode || !valueNode.children)
            return null;
        return valueNode.children
            .map((child) => child.name || child.value || '')
            .join(' ');
    }
    /**
     * Extract API name from JavaScript node
     */
    extractAPIName(node) {
        if (node.type === 'CallExpression') {
            return this.extractAPIName(node.callee);
        }
        else if (node.type === 'MemberExpression') {
            const object = this.extractAPIName(node.object);
            const property = node.property.name;
            return object ? `${object}.${property}` : property;
        }
        else if (node.type === 'Identifier') {
            return node.name;
        }
        return null;
    }
    /**
     * Create scan result summary
     */
    createScanResult(issues, scannedFiles, filesWithIssues) {
        const summary = {
            total: issues.length,
            errors: issues.filter(i => i.severity === 'error').length,
            warnings: issues.filter(i => i.severity === 'warning').length,
            info: issues.filter(i => i.severity === 'info').length,
            baselineSafe: issues.filter(i => i.baseline.baseline === 'widely').length,
            baselineNewly: issues.filter(i => i.baseline.baseline === 'newly').length,
            baselineWidely: issues.filter(i => i.baseline.baseline === 'widely').length
        };
        return {
            issues,
            summary,
            files: {
                scanned: scannedFiles,
                withIssues: filesWithIssues
            }
        };
    }
}
exports.FeatureAnalyzer = FeatureAnalyzer;
//# sourceMappingURL=feature-analyzer.js.map