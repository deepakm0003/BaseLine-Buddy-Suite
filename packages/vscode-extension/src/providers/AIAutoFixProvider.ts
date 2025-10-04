import * as vscode from 'vscode';
import { AIAutoFixEngine, AutoFixSuggestion, FixContext } from '@baseline-buddy/core';

export class AIAutoFixProvider implements vscode.CodeActionProvider {
  private fixEngine: AIAutoFixEngine;

  constructor() {
    this.fixEngine = new AIAutoFixEngine();
  }

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const actions: vscode.CodeAction[] = [];

    // Get diagnostics for the current range
    const diagnostics = context.diagnostics.filter(d => 
      d.source === 'Baseline Buddy' && 
      d.severity === vscode.DiagnosticSeverity.Error
    );

    for (const diagnostic of diagnostics) {
      // Create AI Auto-Fix action
      const autoFixAction = this.createAutoFixAction(document, range, diagnostic);
      if (autoFixAction) {
        actions.push(autoFixAction);
      }

      // Create explain action
      const explainAction = this.createExplainAction(document, range, diagnostic);
      if (explainAction) {
        actions.push(explainAction);
      }
    }

    return actions;
  }

  private createAutoFixAction(
    document: vscode.TextDocument,
    range: vscode.Range,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction | null {
    const action = new vscode.CodeAction(
      '🤖 Fix with AI',
      vscode.CodeActionKind.QuickFix
    );

    action.isPreferred = true;

    action.command = {
      command: 'baseline-buddy.autoFix',
      title: 'AI Auto-Fix',
      arguments: [document, range, diagnostic]
    };

    return action;
  }

  private createExplainAction(
    document: vscode.TextDocument,
    range: vscode.Range,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction | null {
    const action = new vscode.CodeAction(
      '💡 Explain Issue',
      vscode.CodeActionKind.Empty
    );


    action.command = {
      command: 'baseline-buddy.explainIssue',
      title: 'Explain Issue',
      arguments: [document, range, diagnostic]
    };

    return action;
  }

  async executeAutoFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    diagnostic: vscode.Diagnostic
  ): Promise<void> {
    try {
      // Show progress
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "🤖 AI Auto-Fix",
        cancellable: false
      }, async (progress) => {
        progress.report({ increment: 0, message: "Analyzing code..." });

        // Create fix context
        const context: FixContext = {
          filePath: document.fileName,
          lineNumber: range.start.line + 1,
          columnNumber: range.start.character + 1,
          fileType: this.getFileType(document),
          surroundingCode: document.getText(range),
          projectType: this.detectProjectType(document)
        };

        progress.report({ increment: 30, message: "Generating fixes..." });

        // Analyze and get fixes
        const fixes = await this.fixEngine.analyzeAndFix(document.getText(), context);

        if (fixes.length === 0) {
          vscode.window.showWarningMessage('No automatic fixes available for this issue.');
          return;
        }

        progress.report({ increment: 50, message: "Applying fix..." });

        // Select the best fix
        const bestFix = fixes[0];

        // Apply the fix
        const fixedCode = this.fixEngine.applyFix(document.getText(), bestFix, context);

        // Create edit
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(document.lineCount, 0)
        );
        edit.replace(document.uri, fullRange, fixedCode);

        // Apply the edit
        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
          progress.report({ increment: 100, message: "Fix applied successfully!" });

          // Show success message with explanation
          const explanation = this.fixEngine.getFixExplanation(bestFix);
          
          // Show notification
          vscode.window.showInformationMessage(
            `✅ AI Auto-Fix Applied: ${bestFix.originalCode} → ${bestFix.fixedCode}`,
            'View Details'
          ).then(selection => {
            if (selection === 'View Details') {
              this.showFixDetails(bestFix);
            }
          });

          // Clear diagnostics for this range
          this.clearDiagnosticsForRange(document, range);
        } else {
          vscode.window.showErrorMessage('Failed to apply AI Auto-Fix.');
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`AI Auto-Fix failed: ${error}`);
    }
  }

  async executeExplainIssue(
    document: vscode.TextDocument,
    range: vscode.Range,
    diagnostic: vscode.Diagnostic
  ): Promise<void> {
    try {
      // Create fix context
      const context: FixContext = {
        filePath: document.fileName,
        lineNumber: range.start.line + 1,
        columnNumber: range.start.character + 1,
        fileType: this.getFileType(document),
        surroundingCode: document.getText(range),
        projectType: this.detectProjectType(document)
      };

      // Get available fixes
      const issue = this.extractIssueFromDiagnostic(diagnostic);
      const fixes = this.fixEngine.getAvailableFixes(issue, context.fileType);

      if (fixes.length === 0) {
        vscode.window.showWarningMessage('No explanation available for this issue.');
        return;
      }

      // Show explanation
      const bestFix = fixes[0];
      this.showFixDetails(bestFix);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to explain issue: ${error}`);
    }
  }

  private showFixDetails(fix: AutoFixSuggestion): void {
    const panel = vscode.window.createWebviewPanel(
      'baselineFixDetails',
      '🤖 AI Auto-Fix Details',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    const explanation = this.fixEngine.getFixExplanation(fix);
    
    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Auto-Fix Details</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .fix-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .code-block {
            background: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            overflow-x: auto;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-widely { background: #d4edda; color: #155724; }
          .status-newly { background: #fff3cd; color: #856404; }
          .status-limited { background: #f8d7da; color: #721c24; }
          .confidence-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
          }
          .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
          }
          .browser-support {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 15px 0;
          }
          .browser-item {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
          .alternatives {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 15px 0;
          }
          .reasoning {
            background: #f3e5f5;
            border-left: 4px solid #9c27b0;
            padding: 15px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 AI Auto-Fix Applied</h1>
          <p>Intelligent Baseline compliance fix with detailed explanation</p>
        </div>

        <div class="fix-card">
          <h2>📝 Code Changes</h2>
          <div class="code-block">
            <strong>Original:</strong> ${fix.originalCode}
          </div>
          <div class="code-block">
            <strong>Fixed:</strong> ${fix.fixedCode}
          </div>
        </div>

        <div class="fix-card">
          <h2>📊 Baseline Status</h2>
          <span class="status-badge status-${fix.baselineStatus}">
            ${fix.baselineStatus.toUpperCase()}
          </span>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${fix.confidence * 100}%"></div>
          </div>
          <p>Confidence: ${Math.round(fix.confidence * 100)}%</p>
        </div>

        <div class="fix-card">
          <h2>💡 Explanation</h2>
          <p>${fix.explanation}</p>
        </div>

        <div class="fix-card">
          <h2>🌐 Browser Support</h2>
          <div class="browser-support">
            <div class="browser-item">
              <strong>Chrome</strong><br>
              ${fix.browserSupport.chrome}
            </div>
            <div class="browser-item">
              <strong>Firefox</strong><br>
              ${fix.browserSupport.firefox}
            </div>
            <div class="browser-item">
              <strong>Safari</strong><br>
              ${fix.browserSupport.safari}
            </div>
            <div class="browser-item">
              <strong>Edge</strong><br>
              ${fix.browserSupport.edge}
            </div>
          </div>
        </div>

        <div class="alternatives">
          <h3>🔄 Alternative Solutions</h3>
          <ul>
            ${fix.alternatives.map(alt => `<li>${alt}</li>`).join('')}
          </ul>
        </div>

        <div class="reasoning">
          <h3>🧠 AI Reasoning</h3>
          <p>${fix.reasoning}</p>
        </div>
      </body>
      </html>
    `;
  }

  private getFileType(document: vscode.TextDocument): 'css' | 'js' | 'ts' | 'jsx' | 'tsx' | 'html' {
    const fileName = document.fileName.toLowerCase();
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'js';
    if (fileName.endsWith('.ts')) return 'ts';
    if (fileName.endsWith('.jsx')) return 'jsx';
    if (fileName.endsWith('.tsx')) return 'tsx';
    if (fileName.endsWith('.html')) return 'html';
    return 'js'; // default
  }

  private detectProjectType(document: vscode.TextDocument): 'react' | 'vue' | 'angular' | 'vanilla' | 'node' {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) return 'vanilla';

    const packageJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, 'package.json');
    
    try {
      // This is a simplified detection - in a real implementation,
      // you'd read the package.json file
      if (document.fileName.includes('react')) return 'react';
      if (document.fileName.includes('vue')) return 'vue';
      if (document.fileName.includes('angular')) return 'angular';
      return 'vanilla';
    } catch {
      return 'vanilla';
    }
  }

  private extractIssueFromDiagnostic(diagnostic: vscode.Diagnostic): string {
    const message = diagnostic.message.toLowerCase();
    if (message.includes('auto-phrase')) return 'word-break: auto-phrase';
    if (message.includes('subgrid')) return 'subgrid';
    if (message.includes('container')) return '@container';
    if (message.includes('has')) return ':has()';
    if (message.includes('nesting')) return 'css-nesting';
    if (message.includes('dialog')) return '<dialog>';
    if (message.includes('details')) return '<details>';
    return 'unknown';
  }

  private clearDiagnosticsForRange(document: vscode.TextDocument, range: vscode.Range): void {
    // Clear diagnostics for the range - this would need to be implemented
    // with access to the diagnostic collection from the extension
  }
}

export default AIAutoFixProvider;
