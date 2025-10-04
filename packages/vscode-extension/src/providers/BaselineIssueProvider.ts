import * as vscode from 'vscode';
import { WorkingBaselineDetector, WorkingFeatureAnalyzer } from '@baseline-buddy/core';

export class BaselineIssueProvider implements vscode.TreeDataProvider<BaselineIssue> {
    private _onDidChangeTreeData: vscode.EventEmitter<BaselineIssue | undefined | null | void> = new vscode.EventEmitter<BaselineIssue | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BaselineIssue | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        private baselineDetector: WorkingBaselineDetector,
        private featureAnalyzer: WorkingFeatureAnalyzer
    ) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BaselineIssue): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: BaselineIssue): Promise<BaselineIssue[]> {
        if (!element) {
            // Return workspace-level issues
            return this.getWorkspaceIssues();
        }
        return [];
    }

    private async getWorkspaceIssues(): Promise<BaselineIssue[]> {
        const issues: BaselineIssue[] = [];
        
        try {
            // Get all supported files in workspace
            const files = await vscode.workspace.findFiles(
                '{**/*.css,**/*.js,**/*.jsx,**/*.ts,**/*.tsx,**/*.html}',
                '{**/node_modules/**,**/dist/**,**/build/**}'
            );

            for (const file of files) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const content = document.getText();
                    const fileName = file.fsPath.split('/').pop() || file.fsPath.split('\\').pop() || 'unknown';

                    const fileIssues = await this.featureAnalyzer.analyzeFile(content, fileName);
                    
                    for (const issue of fileIssues) {
                        issues.push(new BaselineIssue(
                            issue.feature,
                            issue.message,
                            issue.severity,
                            issue.file || fileName,
                            issue.line,
                            issue.suggestion,
                            file
                        ));
                    }
                } catch (error) {
                    console.error(`Error analyzing file ${file.fsPath}:`, error);
                }
            }
        } catch (error) {
            console.error('Error getting workspace issues:', error);
        }

        return issues;
    }
}

class BaselineIssue extends vscode.TreeItem {
    constructor(
        public readonly feature: string,
        public readonly message: string,
        public readonly severity: string,
        public readonly file: string,
        public readonly line?: number,
        public readonly suggestion?: string,
        public readonly uri?: vscode.Uri
    ) {
        super(feature, vscode.TreeItemCollapsibleState.None);

        this.description = `${file}:${line || '?'}`;
        this.tooltip = `${message}${suggestion ? '\n\nSuggestion: ' + suggestion : ''}`;

        // Set icon based on severity
        this.iconPath = new vscode.ThemeIcon(
            severity === 'error' ? 'error' :
            severity === 'warning' ? 'warning' : 'info'
        );

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
