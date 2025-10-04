import * as vscode from 'vscode';

export class BaselineStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'baseline-buddy.showDashboard';
        this.statusBarItem.show();
    }

    updateStatus(status: 'ready' | 'scanning' | 'scanned' | 'error', issueCount?: number) {
        switch (status) {
            case 'ready':
                this.statusBarItem.text = '$(checklist) Baseline Buddy';
                this.statusBarItem.tooltip = 'Baseline Buddy - Ready';
                this.statusBarItem.backgroundColor = undefined;
                break;
            case 'scanning':
                this.statusBarItem.text = '$(loading~spin) Scanning...';
                this.statusBarItem.tooltip = 'Baseline Buddy - Scanning workspace';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                break;
            case 'scanned':
                if (issueCount && issueCount > 0) {
                    this.statusBarItem.text = `$(warning) ${issueCount} Baseline Issues`;
                    this.statusBarItem.tooltip = `Baseline Buddy - Found ${issueCount} issues`;
                    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                } else {
                    this.statusBarItem.text = '$(check) Baseline Clean';
                    this.statusBarItem.tooltip = 'Baseline Buddy - No issues found';
                    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                }
                break;
            case 'error':
                this.statusBarItem.text = '$(error) Baseline Error';
                this.statusBarItem.tooltip = 'Baseline Buddy - Error occurred';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                break;
        }
    }

    dispose() {
        this.statusBarItem.dispose();
    }
}
