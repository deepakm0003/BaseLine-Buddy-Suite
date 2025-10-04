"use strict";
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
exports.BaselineIssueProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineIssueProvider {
    constructor(baselineDetector, featureAnalyzer) {
        this.baselineDetector = baselineDetector;
        this.featureAnalyzer = featureAnalyzer;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Return workspace-level issues
            return this.getWorkspaceIssues();
        }
        return [];
    }
    async getWorkspaceIssues() {
        const issues = [];
        try {
            // Get all supported files in workspace
            const files = await vscode.workspace.findFiles('{**/*.css,**/*.js,**/*.jsx,**/*.ts,**/*.tsx,**/*.html}', '{**/node_modules/**,**/dist/**,**/build/**}');
            for (const file of files) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const content = document.getText();
                    const fileName = file.fsPath.split('/').pop() || file.fsPath.split('\\').pop() || 'unknown';
                    const fileIssues = await this.featureAnalyzer.analyzeFile(content, fileName);
                    for (const issue of fileIssues) {
                        issues.push(new BaselineIssue(issue.feature, issue.message, issue.severity, issue.file || fileName, issue.line, issue.suggestion, file));
                    }
                }
                catch (error) {
                    console.error(`Error analyzing file ${file.fsPath}:`, error);
                }
            }
        }
        catch (error) {
            console.error('Error getting workspace issues:', error);
        }
        return issues;
    }
}
exports.BaselineIssueProvider = BaselineIssueProvider;
class BaselineIssue extends vscode.TreeItem {
    constructor(feature, message, severity, file, line, suggestion, uri) {
        super(feature, vscode.TreeItemCollapsibleState.None);
        this.feature = feature;
        this.message = message;
        this.severity = severity;
        this.file = file;
        this.line = line;
        this.suggestion = suggestion;
        this.uri = uri;
        this.description = `${file}:${line || '?'}`;
        this.tooltip = `${message}${suggestion ? '\n\nSuggestion: ' + suggestion : ''}`;
        // Set icon based on severity
        this.iconPath = new vscode.ThemeIcon(severity === 'error' ? 'error' :
            severity === 'warning' ? 'warning' : 'info');
        // Set context value for commands
        this.contextValue = 'baselineIssue';
        // Add command to open file
        if (uri) {
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [uri, { selection: line ? new vscode.Range(line - 1, 0, line - 1, 0) : undefined }]
            };
        }
    }
}
//# sourceMappingURL=BaselineIssueProvider.js.map