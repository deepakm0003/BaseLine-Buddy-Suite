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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const core_1 = require("@baseline-buddy/core");
const BaselineIssueProvider_1 = require("./providers/BaselineIssueProvider");
const BaselineHoverProvider_1 = require("./providers/BaselineHoverProvider");
const BaselineCodeActionProvider_1 = require("./providers/BaselineCodeActionProvider");
const AIAutoFixProvider_1 = require("./providers/AIAutoFixProvider");
const BaselineStatusBar_1 = require("./statusBar/BaselineStatusBar");
const BaselineWebviewProvider_1 = require("./webview/BaselineWebviewProvider");
let baselineDetector;
let featureAnalyzer;
let issueProvider;
let hoverProvider;
let autoFixProvider;
let codeActionProvider;
let statusBar;
let webviewProvider;
function activate(context) {
    console.log('Baseline Buddy extension is now active!');
    // Initialize core components
    baselineDetector = new core_1.WorkingBaselineDetector();
    featureAnalyzer = new core_1.WorkingFeatureAnalyzer();
    // Initialize providers
    issueProvider = new BaselineIssueProvider_1.BaselineIssueProvider(baselineDetector, featureAnalyzer);
    hoverProvider = new BaselineHoverProvider_1.BaselineHoverProvider(baselineDetector);
    autoFixProvider = new AIAutoFixProvider_1.AIAutoFixProvider();
    codeActionProvider = new BaselineCodeActionProvider_1.BaselineCodeActionProvider(baselineDetector);
    statusBar = new BaselineStatusBar_1.BaselineStatusBar();
    webviewProvider = new BaselineWebviewProvider_1.BaselineWebviewProvider(context);
    // Register providers
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('baseline-buddy');
    context.subscriptions.push(diagnosticCollection);
    // Register hover provider for CSS, JS, TS, HTML
    const supportedLanguages = ['css', 'javascript', 'typescript', 'html'];
    supportedLanguages.forEach(lang => {
        context.subscriptions.push(vscode.languages.registerHoverProvider(lang, hoverProvider));
    });
    // Register code action provider
    supportedLanguages.forEach(lang => {
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider(lang, codeActionProvider));
    });
    // Register AI Auto-Fix provider
    supportedLanguages.forEach(lang => {
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider(lang, autoFixProvider));
    });
    // Register commands
    registerCommands(context, diagnosticCollection);
    // Register views
    registerViews(context);
    // Start workspace scanning
    scanWorkspace(diagnosticCollection);
    // Watch for file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.{css,js,jsx,ts,tsx,html}');
    watcher.onDidChange(uri => scanFile(uri, diagnosticCollection));
    watcher.onDidCreate(uri => scanFile(uri, diagnosticCollection));
    watcher.onDidDelete(uri => diagnosticCollection.delete(uri));
    context.subscriptions.push(watcher);
    // Update status bar
    statusBar.updateStatus('ready');
}
exports.activate = activate;
function registerCommands(context, diagnosticCollection) {
    // Scan workspace command
    const scanWorkspaceCommand = vscode.commands.registerCommand('baseline-buddy.scanWorkspace', async () => {
        vscode.window.showInformationMessage('Scanning workspace for Baseline issues...');
        await scanWorkspace(diagnosticCollection);
        vscode.window.showInformationMessage('Workspace scan completed!');
    });
    // Scan current file command
    const scanFileCommand = vscode.commands.registerCommand('baseline-buddy.scanFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await scanFile(editor.document.uri, diagnosticCollection);
            vscode.window.showInformationMessage('File scan completed!');
        }
    });
    // Show dashboard command
    const showDashboardCommand = vscode.commands.registerCommand('baseline-buddy.showDashboard', () => {
        webviewProvider.showDashboard();
    });
    // Auto-fix command
    const autoFixCommand = vscode.commands.registerCommand('baseline-buddy.autoFix', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await autoFixFile(editor, diagnosticCollection);
        }
    });
    // AI Auto-Fix command
    const aiAutoFixCommand = vscode.commands.registerCommand('baseline-buddy.autoFix', async (document, range, diagnostic) => {
        await autoFixProvider.executeAutoFix(document, range, diagnostic);
    });
    // Explain issue command
    const explainIssueCommand = vscode.commands.registerCommand('baseline-buddy.explainIssue', async (document, range, diagnostic) => {
        await autoFixProvider.executeExplainIssue(document, range, diagnostic);
    });
    // Show feature info command
    const showFeatureInfoCommand = vscode.commands.registerCommand('baseline-buddy.showFeatureInfo', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            const word = editor.document.getWordRangeAtPosition(position);
            if (word) {
                const feature = editor.document.getText(word);
                await showFeatureInfo(feature);
            }
        }
    });
    context.subscriptions.push(scanWorkspaceCommand, scanFileCommand, showDashboardCommand, autoFixCommand, aiAutoFixCommand, explainIssueCommand, showFeatureInfoCommand);
}
function registerViews(context) {
    // Register tree data provider for issues
    const issuesProvider = new BaselineIssueProvider_1.BaselineIssueProvider(baselineDetector, featureAnalyzer);
    vscode.window.createTreeView('baseline-buddy-issues', {
        treeDataProvider: issuesProvider
    });
    // Register features view
    const featuresProvider = new BaselineFeatureProvider();
    vscode.window.createTreeView('baseline-buddy-features', {
        treeDataProvider: featuresProvider
    });
}
async function scanWorkspace(diagnosticCollection) {
    const config = vscode.workspace.getConfiguration('baseline-buddy');
    const includePatterns = config.get('includePatterns', ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html']);
    const excludePatterns = config.get('excludePatterns', ['**/node_modules/**', '**/dist/**', '**/build/**']);
    const files = await vscode.workspace.findFiles(`{${includePatterns.join(',')}}`, `{${excludePatterns.join(',')}}`);
    let totalIssues = 0;
    for (const file of files) {
        const issues = await scanFile(file, diagnosticCollection);
        totalIssues += issues.length;
    }
    statusBar.updateStatus('scanned', totalIssues);
}
async function scanFile(uri, diagnosticCollection) {
    try {
        const document = await vscode.workspace.openTextDocument(uri);
        const content = document.getText();
        const fileName = uri.fsPath.split('/').pop() || uri.fsPath.split('\\').pop() || 'unknown';
        // Analyze file content
        const issues = await featureAnalyzer.analyzeFile(content, fileName);
        // Convert to VS Code diagnostics
        const diagnostics = issues.map(issue => {
            const range = new vscode.Range(issue.line ? issue.line - 1 : 0, 0, issue.line ? issue.line - 1 : 0, document.lineAt(issue.line ? issue.line - 1 : 0).text.length);
            const severity = issue.severity === 'error' ? vscode.DiagnosticSeverity.Error :
                issue.severity === 'warning' ? vscode.DiagnosticSeverity.Warning :
                    vscode.DiagnosticSeverity.Information;
            const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
            diagnostic.source = 'Baseline Buddy';
            diagnostic.code = issue.feature;
            if (issue.suggestion) {
                diagnostic.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(uri, range), `Suggestion: ${issue.suggestion}`)];
            }
            return diagnostic;
        });
        diagnosticCollection.set(uri, diagnostics);
        return diagnostics;
    }
    catch (error) {
        console.error('Error scanning file:', error);
        return [];
    }
}
async function autoFixFile(editor, diagnosticCollection) {
    const document = editor.document;
    const content = document.getText();
    const fileName = document.fileName.split('/').pop() || document.fileName.split('\\').pop() || 'unknown';
    try {
        const issues = await featureAnalyzer.analyzeFile(content, fileName);
        const fixableIssues = issues.filter(issue => issue.suggestion);
        if (fixableIssues.length === 0) {
            vscode.window.showInformationMessage('No auto-fixable issues found in this file.');
            return;
        }
        // Apply fixes
        const edit = new vscode.WorkspaceEdit();
        for (const issue of fixableIssues) {
            if (issue.line && issue.suggestion) {
                const lineIndex = issue.line - 1;
                const line = document.lineAt(lineIndex);
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.text.length);
                // Simple auto-fix logic (can be enhanced)
                let newText = line.text;
                if (issue.feature.includes('word-break: auto-phrase')) {
                    newText = newText.replace('word-break: auto-phrase', 'word-break: break-word');
                }
                edit.replace(document.uri, range, newText);
            }
        }
        await vscode.workspace.applyEdit(edit);
        await scanFile(document.uri, diagnosticCollection);
        vscode.window.showInformationMessage(`Applied ${fixableIssues.length} fixes!`);
    }
    catch (error) {
        vscode.window.showErrorMessage('Error applying auto-fixes: ' + error);
    }
}
async function showFeatureInfo(feature) {
    try {
        const info = await baselineDetector.getFeatureInfo(feature);
        if (info) {
            const panel = vscode.window.createWebviewPanel('baselineFeatureInfo', `Baseline Info: ${feature}`, vscode.ViewColumn.One, { enableScripts: true });
            panel.webview.html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Baseline Info</title>
                    <style>
                        body { font-family: var(--vscode-font-family); padding: 20px; }
                        .header { background: #007acc; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                        .info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; }
                        .status { font-weight: bold; color: #007acc; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${info.name}</h1>
                        <p>${info.description}</p>
                    </div>
                    <div class="info">
                        <h3>Baseline Status</h3>
                        <p class="status">${info.baseline}</p>
                        ${info.baseline_high_date ? `<p>Widely Available Since: ${info.baseline_high_date}</p>` : ''}
                        ${info.baseline_low_date ? `<p>Newly Available Since: ${info.baseline_low_date}</p>` : ''}
                    </div>
                    <div class="info">
                        <h3>Browser Support</h3>
                        <p>Chrome: ${info.support.chrome || 'N/A'}</p>
                        <p>Firefox: ${info.support.firefox || 'N/A'}</p>
                        <p>Safari: ${info.support.safari || 'N/A'}</p>
                        <p>Edge: ${info.support.edge || 'N/A'}</p>
                    </div>
                </body>
                </html>
            `;
        }
        else {
            vscode.window.showInformationMessage(`No Baseline information found for: ${feature}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Error getting feature info: ' + error);
    }
}
function deactivate() {
    console.log('Baseline Buddy extension is now deactivated');
}
exports.deactivate = deactivate;
// Helper classes
class BaselineFeatureProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve([
                new vscode.TreeItem('CSS Grid', vscode.TreeItemCollapsibleState.None),
                new vscode.TreeItem('CSS Subgrid', vscode.TreeItemCollapsibleState.None),
                new vscode.TreeItem('Container Queries', vscode.TreeItemCollapsibleState.None),
                new vscode.TreeItem(':has() Selector', vscode.TreeItemCollapsibleState.None),
                new vscode.TreeItem('word-break: auto-phrase', vscode.TreeItemCollapsibleState.None)
            ]);
        }
        return Promise.resolve([]);
    }
}
//# sourceMappingURL=extension.js.map