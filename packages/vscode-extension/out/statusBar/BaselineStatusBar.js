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
exports.BaselineStatusBar = void 0;
const vscode = __importStar(require("vscode"));
class BaselineStatusBar {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'baseline-buddy.showDashboard';
        this.statusBarItem.show();
    }
    updateStatus(status, issueCount) {
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
                }
                else {
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
exports.BaselineStatusBar = BaselineStatusBar;
//# sourceMappingURL=BaselineStatusBar.js.map