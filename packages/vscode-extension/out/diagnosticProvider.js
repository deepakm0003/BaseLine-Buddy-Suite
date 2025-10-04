"use strict";
/**
 * Diagnostic Provider for Baseline issues
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselineDiagnosticProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class BaselineDiagnosticProvider {
    constructor(detector, analyzer) {
        this.detector = detector;
        this.analyzer = analyzer;
    }
    async scanWorkspace(workspaceUri, diagnosticCollection) {
        const workspacePath = workspaceUri.fsPath;
        const files = await this.getFilesToScan(workspacePath);
        for (const file of files) {
            const uri = vscode.Uri.file(file);
            await this.updateDiagnostics(uri, diagnosticCollection);
        }
    }
    async updateDiagnostics(uri, diagnosticCollection) {
        if (!this.shouldScanFile(uri)) {
            return;
        }
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();
            const issues = await this.analyzer.analyzeFile(uri.fsPath, content);
            const diagnostics = issues.map(issue => this.createDiagnostic(issue, document));
            diagnosticCollection.set(uri, diagnostics);
        }
        catch (error) {
            console.error(`Failed to analyze ${uri.fsPath}:`, error);
        }
    }
    async getFilesToScan(workspacePath) {
        const files = [];
        const includePatterns = this.getIncludePatterns();
        const excludePatterns = this.getExcludePatterns();
        await this.walkDirectory(workspacePath, (filePath) => {
            const relativePath = path.relative(workspacePath, filePath);
            const shouldInclude = includePatterns.some(pattern => this.matchesPattern(relativePath, pattern));
            const shouldExclude = excludePatterns.some(pattern => this.matchesPattern(relativePath, pattern));
            if (shouldInclude && !shouldExclude) {
                files.push(filePath);
            }
        });
        return files;
    }
    async walkDirectory(dirPath, callback) {
        try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stat = fs.statSync(itemPath);
                if (stat.isDirectory()) {
                    await this.walkDirectory(itemPath, callback);
                }
                else if (stat.isFile()) {
                    callback(itemPath);
                }
            }
        }
        catch (error) {
            console.error(`Failed to walk directory ${dirPath}:`, error);
        }
    }
    shouldScanFile(uri) {
        const ext = path.extname(uri.fsPath).toLowerCase();
        const supportedExtensions = ['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm'];
        return supportedExtensions.includes(ext);
    }
    getIncludePatterns() {
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        return config.get('includePatterns', ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html']);
    }
    getExcludePatterns() {
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        return config.get('excludePatterns', ['**/node_modules/**', '**/dist/**', '**/build/**']);
    }
    matchesPattern(filePath, pattern) {
        const regex = new RegExp(pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\./g, '\\.'));
        return regex.test(filePath);
    }
    createDiagnostic(issue, document) {
        const range = new vscode.Range((issue.line || 1) - 1, (issue.column || 1) - 1, (issue.line || 1) - 1, (issue.column || 1) - 1);
        const severity = this.getSeverity(issue.severity);
        const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
        diagnostic.source = 'Baseline Buddy';
        diagnostic.code = issue.feature;
        if (issue.suggestion) {
            diagnostic.relatedInformation = [
                new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, range), issue.suggestion)
            ];
        }
        return diagnostic;
    }
    getSeverity(severity) {
        switch (severity) {
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            case 'info':
                return vscode.DiagnosticSeverity.Information;
            default:
                return vscode.DiagnosticSeverity.Warning;
        }
    }
}
exports.BaselineDiagnosticProvider = BaselineDiagnosticProvider;
//# sourceMappingURL=diagnosticProvider.js.map