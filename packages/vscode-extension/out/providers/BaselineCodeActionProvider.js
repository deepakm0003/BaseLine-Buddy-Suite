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
exports.BaselineCodeActionProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineCodeActionProvider {
    constructor(baselineDetector) {
        this.baselineDetector = baselineDetector;
    }
    provideCodeActions(document, range, context, token) {
        const actions = [];
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
    createQuickFix(document, diagnostic) {
        const feature = diagnostic.code;
        if (!feature)
            return undefined;
        // Create quick fix based on the feature
        let fix;
        if (feature.includes('word-break: auto-phrase')) {
            fix = new vscode.CodeAction('Replace with word-break: break-word', vscode.CodeActionKind.QuickFix);
            fix.edit = new vscode.WorkspaceEdit();
            fix.edit.replace(document.uri, diagnostic.range, document.getText(diagnostic.range).replace('auto-phrase', 'break-word'));
        }
        else if (feature.includes('subgrid')) {
            fix = new vscode.CodeAction('Add fallback for older browsers', vscode.CodeActionKind.QuickFix);
            fix.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(diagnostic.range.start.line);
            const newText = line.text + '\n  /* Fallback for older browsers */\n  display: block;';
            fix.edit.replace(document.uri, diagnostic.range, newText);
        }
        else if (feature.includes('container-queries')) {
            fix = new vscode.CodeAction('Add media query fallback', vscode.CodeActionKind.QuickFix);
            fix.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(diagnostic.range.start.line);
            const newText = line.text + '\n  /* Media query fallback */\n  @media (min-width: 768px) { /* fallback styles */ }';
            fix.edit.replace(document.uri, diagnostic.range, newText);
        }
        else if (feature.includes(':has()')) {
            fix = new vscode.CodeAction('Add JavaScript fallback', vscode.CodeActionKind.QuickFix);
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
    createInfoAction(diagnostic) {
        const action = new vscode.CodeAction('Show Baseline Information', vscode.CodeActionKind.Empty);
        action.command = {
            command: 'baseline-buddy.showFeatureInfo',
            title: 'Show Feature Information',
            arguments: [diagnostic.code]
        };
        return action;
    }
}
exports.BaselineCodeActionProvider = BaselineCodeActionProvider;
//# sourceMappingURL=BaselineCodeActionProvider.js.map