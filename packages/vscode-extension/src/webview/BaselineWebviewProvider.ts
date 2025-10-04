import * as vscode from 'vscode';
import { WorkingBaselineDetector, WorkingFeatureAnalyzer } from '@baseline-buddy/core';

export class BaselineWebviewProvider {
    private panel: vscode.WebviewPanel | undefined;

    constructor(private context: vscode.ExtensionContext) {}

    showDashboard() {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'baselineBuddyDashboard',
            'Baseline Buddy Dashboard',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        this.panel.webview.html = this.getDashboardHtml();

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });

        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'scanWorkspace':
                        await this.scanWorkspace();
                        break;
                    case 'getFeatureInfo':
                        const info = await this.getFeatureInfo(message.feature);
                        this.panel?.webview.postMessage({
                            command: 'featureInfo',
                            data: info
                        });
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );
    }

    private async scanWorkspace() {
        try {
            const files = await vscode.workspace.findFiles(
                '{**/*.css,**/*.js,**/*.jsx,**/*.ts,**/*.tsx,**/*.html}',
                '{**/node_modules/**,**/dist/**,**/build/**}'
            );

            const baselineDetector = new WorkingBaselineDetector();
            const featureAnalyzer = new WorkingFeatureAnalyzer();
            const results: any[] = [];

            for (const file of files) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const content = document.getText();
                    const fileName = file.fsPath.split('/').pop() || file.fsPath.split('\\').pop() || 'unknown';

                    const issues = await featureAnalyzer.analyzeFile(content, fileName);
                    results.push({
                        file: fileName,
                        path: file.fsPath,
                        issues: issues
                    });
                } catch (error) {
                    console.error(`Error analyzing file ${file.fsPath}:`, error);
                }
            }

            this.panel?.webview.postMessage({
                command: 'scanResults',
                data: results
            });
        } catch (error) {
            console.error('Error scanning workspace:', error);
        }
    }

    private async getFeatureInfo(feature: string) {
        try {
            const baselineDetector = new WorkingBaselineDetector();
            return await baselineDetector.getFeatureInfo(feature);
        } catch (error) {
            console.error('Error getting feature info:', error);
            return null;
        }
    }

    private getDashboardHtml(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Baseline Buddy Dashboard</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        margin: 0;
                        padding: 20px;
                        background: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 8px;
                    }
                    .header h1 {
                        color: var(--vscode-textLink-foreground);
                        margin: 0 0 10px 0;
                    }
                    .controls {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 20px;
                        justify-content: center;
                    }
                    button {
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                    .results {
                        margin-top: 20px;
                    }
                    .file-result {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 8px;
                        margin: 10px 0;
                        padding: 15px;
                    }
                    .file-header {
                        font-weight: bold;
                        color: var(--vscode-textLink-foreground);
                        margin-bottom: 10px;
                    }
                    .issue {
                        background: var(--vscode-editor-background);
                        border-left: 4px solid var(--vscode-charts-orange);
                        padding: 10px;
                        margin: 5px 0;
                        border-radius: 4px;
                    }
                    .issue.error {
                        border-left-color: var(--vscode-charts-red);
                    }
                    .issue.warning {
                        border-left-color: var(--vscode-charts-orange);
                    }
                    .issue.info {
                        border-left-color: var(--vscode-charts-blue);
                    }
                    .issue-title {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .issue-message {
                        color: var(--vscode-descriptionForeground);
                        margin-bottom: 5px;
                    }
                    .issue-suggestion {
                        color: var(--vscode-textLink-foreground);
                        font-style: italic;
                    }
                    .loading {
                        text-align: center;
                        padding: 20px;
                        color: var(--vscode-descriptionForeground);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏆 Baseline Buddy Dashboard</h1>
                    <p>AI-powered Baseline compliance checking for modern web features</p>
                </div>

                <div class="controls">
                    <button onclick="scanWorkspace()">Scan Workspace</button>
                    <button onclick="showFeatures()">Show Features</button>
                </div>

                <div id="results" class="results">
                    <div class="loading">Click "Scan Workspace" to start analyzing your files for Baseline compliance issues.</div>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();

                    function scanWorkspace() {
                        document.getElementById('results').innerHTML = '<div class="loading">Scanning workspace...</div>';
                        vscode.postMessage({ command: 'scanWorkspace' });
                    }

                    function showFeatures() {
                        // Show available Baseline features
                        const features = [
                            { name: 'CSS Grid', status: 'Widely Available', description: 'CSS Grid Layout' },
                            { name: 'CSS Subgrid', status: 'Newly Available', description: 'CSS Grid Subgrid' },
                            { name: 'Container Queries', status: 'Newly Available', description: 'CSS Container Queries' },
                            { name: ':has() Selector', status: 'Newly Available', description: 'CSS :has() pseudo-class' },
                            { name: 'word-break: auto-phrase', status: 'Limited Support', description: 'CSS word-break auto-phrase value' }
                        ];

                        let html = '<h3>Available Baseline Features</h3>';
                        features.forEach(feature => {
                            const statusColor = feature.status === 'Widely Available' ? '🟢' : 
                                              feature.status === 'Newly Available' ? '🟡' : '🔴';
                            html += \`
                                <div class="file-result">
                                    <div class="file-header">\${statusColor} \${feature.name}</div>
                                    <div class="issue-message">\${feature.description}</div>
                                    <div class="issue-suggestion">Status: \${feature.status}</div>
                                </div>
                            \`;
                        });

                        document.getElementById('results').innerHTML = html;
                    }

                    // Handle messages from extension
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'scanResults':
                                displayResults(message.data);
                                break;
                            case 'featureInfo':
                                displayFeatureInfo(message.data);
                                break;
                        }
                    });

                    function displayResults(results) {
                        if (results.length === 0) {
                            document.getElementById('results').innerHTML = '<div class="loading">No files found to scan.</div>';
                            return;
                        }

                        let html = '<h3>Scan Results</h3>';
                        let totalIssues = 0;

                        results.forEach(result => {
                            if (result.issues.length > 0) {
                                totalIssues += result.issues.length;
                                html += \`
                                    <div class="file-result">
                                        <div class="file-header">📄 \${result.file}</div>
                                        <div class="issue-message">Path: \${result.path}</div>
                                \`;

                                result.issues.forEach(issue => {
                                    html += \`
                                        <div class="issue \${issue.severity}">
                                            <div class="issue-title">\${issue.feature}</div>
                                            <div class="issue-message">\${issue.message}</div>
                                            \${issue.suggestion ? \`<div class="issue-suggestion">💡 \${issue.suggestion}</div>\` : ''}
                                        </div>
                                    \`;
                                });

                                html += '</div>';
                            }
                        });

                        if (totalIssues === 0) {
                            html = '<div class="loading">✅ No Baseline issues found! All features are compliant.</div>';
                        } else {
                            html = \`<div class="loading">Found \${totalIssues} Baseline issues across \${results.length} files.</div>\` + html;
                        }

                        document.getElementById('results').innerHTML = html;
                    }

                    function displayFeatureInfo(info) {
                        if (info) {
                            const statusColor = info.baseline === 'widely' ? '🟢' : 
                                              info.baseline === 'newly' ? '🟡' : '🔴';
                            
                            let html = \`
                                <div class="file-result">
                                    <div class="file-header">\${statusColor} \${info.name}</div>
                                    <div class="issue-message">\${info.description}</div>
                                    <div class="issue-suggestion">Baseline Status: \${info.baseline}</div>
                                </div>
                            \`;
                            
                            document.getElementById('results').innerHTML = html;
                        }
                    }
                </script>
            </body>
            </html>
        `;
    }
}
