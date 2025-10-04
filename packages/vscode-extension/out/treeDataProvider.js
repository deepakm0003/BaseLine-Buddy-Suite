"use strict";
/**
 * Tree Data Provider for Baseline issues and features
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
exports.BaselineTreeItem = exports.BaselineTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineTreeDataProvider {
    constructor(detector, analyzer) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.issues = new Map();
        this.detector = detector;
        this.analyzer = analyzer;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            return this.getRootItems();
        }
        if (element.type === 'workspace') {
            return this.getWorkspaceItems();
        }
        if (element.type === 'file') {
            return this.getFileItems(element);
        }
        return [];
    }
    getRootItems() {
        const items = [];
        // Workspace issues
        if (this.issues.size > 0) {
            items.push(new BaselineTreeItem('Issues', vscode.TreeItemCollapsibleState.Expanded, 'workspace', undefined, 'baseline-buddy-issues'));
        }
        // Features
        items.push(new BaselineTreeItem('Features', vscode.TreeItemCollapsibleState.Collapsed, 'workspace', undefined, 'baseline-buddy-features'));
        return items;
    }
    getWorkspaceItems() {
        const items = [];
        // Group issues by file
        for (const [filePath, diagnostics] of this.issues) {
            const fileName = filePath.split('/').pop() || filePath;
            const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
            const warningCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
            const label = `${fileName} (${errorCount} errors, ${warningCount} warnings)`;
            const item = new BaselineTreeItem(label, vscode.TreeItemCollapsibleState.Collapsed, 'file', filePath, 'baseline-buddy-file');
            item.resourceUri = vscode.Uri.file(filePath);
            items.push(item);
        }
        return items;
    }
    getFileItems(element) {
        const filePath = element.resourcePath;
        if (!filePath) {
            return [];
        }
        const diagnostics = this.issues.get(filePath) || [];
        const items = [];
        for (const diagnostic of diagnostics) {
            const severity = this.getSeverityIcon(diagnostic.severity);
            const label = `${severity} ${diagnostic.message}`;
            const item = new BaselineTreeItem(label, vscode.TreeItemCollapsibleState.None, 'issue', filePath, 'baseline-buddy-issue');
            item.resourceUri = vscode.Uri.file(filePath);
            item.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [vscode.Uri.file(filePath), { selection: diagnostic.range }]
            };
            items.push(item);
        }
        return items;
    }
    getSeverityIcon(severity) {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return '❌';
            case vscode.DiagnosticSeverity.Warning:
                return '⚠️';
            case vscode.DiagnosticSeverity.Information:
                return 'ℹ️';
            default:
                return '❓';
        }
    }
    updateIssues(issues) {
        this.issues = issues;
        this.refresh();
    }
}
exports.BaselineTreeDataProvider = BaselineTreeDataProvider;
class BaselineTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState, type, resourcePath, contextValue) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.resourcePath = resourcePath;
        this.contextValue = contextValue;
        if (type === 'workspace') {
            this.iconPath = new vscode.ThemeIcon('folder');
        }
        else if (type === 'file') {
            this.iconPath = new vscode.ThemeIcon('file');
        }
        else if (type === 'issue') {
            this.iconPath = new vscode.ThemeIcon('warning');
        }
    }
}
exports.BaselineTreeItem = BaselineTreeItem;
//# sourceMappingURL=treeDataProvider.js.map