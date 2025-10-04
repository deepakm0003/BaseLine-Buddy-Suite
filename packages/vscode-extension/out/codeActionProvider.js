"use strict";
/**
 * Code Action Provider for Baseline auto-fixes
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
exports.BaselineCodeActionProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineCodeActionProvider {
    constructor(detector, aiEngine) {
        this.detector = detector;
        this.aiEngine = aiEngine;
    }
    async provideCodeActions(document, range, context, token) {
        const actions = [];
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        if (!config.get('enableAI', true)) {
            return actions;
        }
        // Get diagnostics for the current range
        const diagnostics = context.diagnostics.filter(d => d.source === 'Baseline Buddy');
        for (const diagnostic of diagnostics) {
            const feature = diagnostic.code;
            const baselineStatus = this.detector.getBaselineStatus(feature);
            if (!baselineStatus) {
                continue;
            }
            // Generate AI suggestions
            const suggestion = this.aiEngine.generateSuggestion({
                type: this.detectFeatureType(document, range),
                feature,
                baseline: baselineStatus,
                severity: this.getSeverityFromDiagnostic(diagnostic.severity),
                message: diagnostic.message,
                line: range.start.line + 1,
                column: range.start.character + 1,
                file: document.fileName
            });
            // Add auto-fix action
            if (suggestion.autoFix) {
                const fixAction = new vscode.CodeAction(`Fix: ${feature}`, vscode.CodeActionKind.QuickFix);
                fixAction.diagnostics = [diagnostic];
                fixAction.edit = new vscode.WorkspaceEdit();
                fixAction.edit.replace(document.uri, range, suggestion.autoFix);
                fixAction.isPreferred = true;
                actions.push(fixAction);
            }
            // Add alternative suggestions
            if (suggestion.alternatives.length > 0) {
                for (const alternative of suggestion.alternatives) {
                    const altAction = new vscode.CodeAction(`Alternative: ${alternative}`, vscode.CodeActionKind.QuickFix);
                    altAction.diagnostics = [diagnostic];
                    altAction.command = {
                        title: 'Show Alternative',
                        command: 'baseline-buddy.showAlternative',
                        arguments: [alternative, feature]
                    };
                    actions.push(altAction);
                }
            }
            // Add learning snippet action
            if (suggestion.learningSnippet) {
                const learnAction = new vscode.CodeAction(`Learn: ${feature}`, vscode.CodeActionKind.Empty);
                learnAction.diagnostics = [diagnostic];
                learnAction.command = {
                    title: 'Show Learning Snippet',
                    command: 'baseline-buddy.showLearningSnippet',
                    arguments: [suggestion.learningSnippet, feature]
                };
                actions.push(learnAction);
            }
        }
        return actions;
    }
    async getAutoFixes(document, diagnostics) {
        const fixes = [];
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        if (!config.get('autoFix', false)) {
            return fixes;
        }
        for (const diagnostic of diagnostics) {
            if (diagnostic.source !== 'Baseline Buddy') {
                continue;
            }
            const feature = diagnostic.code;
            const baselineStatus = this.detector.getBaselineStatus(feature);
            if (!baselineStatus) {
                continue;
            }
            const suggestion = this.aiEngine.generateSuggestion({
                type: this.detectFeatureType(document, diagnostic.range),
                feature,
                baseline: baselineStatus,
                severity: this.getSeverityFromDiagnostic(diagnostic.severity),
                message: diagnostic.message,
                line: diagnostic.range.start.line + 1,
                column: diagnostic.range.start.character + 1,
                file: document.fileName
            });
            if (suggestion.autoFix) {
                const range = diagnostic.range;
                fixes.push(new vscode.TextEdit(range, suggestion.autoFix));
            }
        }
        return fixes;
    }
    detectFeatureType(document, range) {
        const language = document.languageId;
        switch (language) {
            case 'css':
                return 'css';
            case 'javascript':
            case 'typescript':
                return 'javascript';
            case 'html':
                return 'html';
            default:
                return 'css'; // Default fallback
        }
    }
    getSeverityFromDiagnostic(severity) {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            case vscode.DiagnosticSeverity.Information:
                return 'info';
            default:
                return 'warning';
        }
    }
}
exports.BaselineCodeActionProvider = BaselineCodeActionProvider;
//# sourceMappingURL=codeActionProvider.js.map