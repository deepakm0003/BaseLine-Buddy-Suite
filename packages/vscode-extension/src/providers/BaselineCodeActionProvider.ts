import * as vscode from 'vscode';
import { WorkingBaselineDetector } from '@baseline-buddy/core';

export class BaselineCodeActionProvider implements vscode.CodeActionProvider {
    constructor(private baselineDetector: WorkingBaselineDetector) {}

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        const actions: vscode.CodeAction[] = [];

        // Get diagnostics for the current range
        const diagnostics = context.diagnostics.filter(d => d.source === 'Baseline Buddy');
        
        for (const diagnostic of diagnostics) {
            // Add quick fix action
            const quickFix = this.createQuickFix(document, diagnostic);
            if (quickFix) {
                actions.push(quickFix);
            }

            // Add info action
            const infoAction = this.createInfoAction(diagnostic);
            if (infoAction) {
                actions.push(infoAction);
            }
        }

        return actions;
    }

    private createQuickFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction | undefined {
        const feature = diagnostic.code as string;
        if (!feature) return undefined;

        // Create quick fix based on the feature
        let fix: vscode.CodeAction | undefined;

        if (feature.includes('word-break: auto-phrase')) {
            fix = new vscode.CodeAction(
                'Replace with word-break: break-word',
                vscode.CodeActionKind.QuickFix
            );
            fix.edit = new vscode.WorkspaceEdit();
            fix.edit.replace(
                document.uri,
                diagnostic.range,
                document.getText(diagnostic.range).replace('auto-phrase', 'break-word')
            );
        } else if (feature.includes('subgrid')) {
            fix = new vscode.CodeAction(
                'Add fallback for older browsers',
                vscode.CodeActionKind.QuickFix
            );
            fix.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(diagnostic.range.start.line);
            const newText = line.text + '\n  /* Fallback for older browsers */\n  display: block;';
            fix.edit.replace(document.uri, diagnostic.range, newText);
        } else if (feature.includes('container-queries')) {
            fix = new vscode.CodeAction(
                'Add media query fallback',
                vscode.CodeActionKind.QuickFix
            );
            fix.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(diagnostic.range.start.line);
            const newText = line.text + '\n  /* Media query fallback */\n  @media (min-width: 768px) { /* fallback styles */ }';
            fix.edit.replace(document.uri, diagnostic.range, newText);
        } else if (feature.includes(':has()')) {
            fix = new vscode.CodeAction(
                'Add JavaScript fallback',
                vscode.CodeActionKind.QuickFix
            );
            fix.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(diagnostic.range.start.line);
            const newText = line.text + '\n  /* JavaScript fallback for :has() */\n  /* Use querySelector in JS for older browsers */';
            fix.edit.replace(document.uri, diagnostic.range, newText);
        }

        if (fix) {
            fix.diagnostics = [diagnostic];
            fix.isPreferred = true;
        }

        return fix;
    }

    private createInfoAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'Show Baseline Information',
            vscode.CodeActionKind.Empty
        );
        action.command = {
            command: 'baseline-buddy.showFeatureInfo',
            title: 'Show Feature Information',
            arguments: [diagnostic.code]
        };
        return action;
    }
}
