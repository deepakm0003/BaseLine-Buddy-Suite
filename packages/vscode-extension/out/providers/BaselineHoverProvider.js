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
exports.BaselineHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineHoverProvider {
    constructor(baselineDetector) {
        this.baselineDetector = baselineDetector;
    }
    async provideHover(document, position, token) {
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        if (!config.get('showHoverInfo', true)) {
            return undefined;
        }
        try {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }
            const word = document.getText(wordRange);
            const line = document.lineAt(position.line);
            const lineText = line.text;
            // Check for CSS properties and values
            const cssPropertyMatch = lineText.match(/(\w+):\s*([^;]+)/);
            if (cssPropertyMatch) {
                const property = cssPropertyMatch[1];
                const value = cssPropertyMatch[2].trim();
                // Check for specific Baseline features
                const baselineInfo = await this.getBaselineInfo(property, value, lineText);
                if (baselineInfo) {
                    return new vscode.Hover(baselineInfo);
                }
            }
            // Check for specific keywords
            const baselineInfo = await this.getBaselineInfo(word, '', lineText);
            if (baselineInfo) {
                return new vscode.Hover(baselineInfo);
            }
        }
        catch (error) {
            console.error('Error providing hover info:', error);
        }
        return undefined;
    }
    async getBaselineInfo(property, value, lineText) {
        try {
            // Check for CSS Grid
            if (property === 'display' && value.includes('grid')) {
                const info = await this.baselineDetector.getFeatureInfo('grid');
                if (info) {
                    return this.createHoverContent(info, 'CSS Grid is widely supported across all modern browsers.');
                }
            }
            // Check for CSS Subgrid
            if (value.includes('subgrid')) {
                const info = await this.baselineDetector.getFeatureInfo('subgrid');
                if (info) {
                    return this.createHoverContent(info, 'CSS Subgrid is newly available. Use with caution in older browsers.');
                }
            }
            // Check for Container Queries
            if (lineText.includes('@container')) {
                const info = await this.baselineDetector.getFeatureInfo('container-queries');
                if (info) {
                    return this.createHoverContent(info, 'Container Queries are newly available. Consider media queries as fallback.');
                }
            }
            // Check for :has() selector
            if (lineText.includes(':has(')) {
                const info = await this.baselineDetector.getFeatureInfo('has-selector');
                if (info) {
                    return this.createHoverContent(info, ':has() selector is newly available. Use with caution.');
                }
            }
            // Check for word-break: auto-phrase
            if (property === 'word-break' && value.includes('auto-phrase')) {
                const info = await this.baselineDetector.getFeatureInfo('word-break-auto-phrase');
                if (info) {
                    return this.createHoverContent(info, 'word-break: auto-phrase has limited support. Consider word-break: break-word for better compatibility.');
                }
            }
        }
        catch (error) {
            console.error('Error getting baseline info:', error);
        }
        return undefined;
    }
    createHoverContent(info, message) {
        const content = new vscode.MarkdownString();
        content.isTrusted = true;
        const statusColor = info.baseline === 'widely' ? '🟢' :
            info.baseline === 'newly' ? '🟡' : '🔴';
        const statusText = info.baseline === 'widely' ? 'Widely Available' :
            info.baseline === 'newly' ? 'Newly Available' : 'Limited Support';
        content.appendMarkdown(`## ${statusColor} ${info.name}\n\n`);
        content.appendMarkdown(`**Baseline Status:** ${statusText}\n\n`);
        content.appendMarkdown(`${message}\n\n`);
        if (info.baseline_high_date) {
            content.appendMarkdown(`**Widely Available Since:** ${info.baseline_high_date}\n\n`);
        }
        if (info.baseline_low_date) {
            content.appendMarkdown(`**Newly Available Since:** ${info.baseline_low_date}\n\n`);
        }
        content.appendMarkdown(`**Browser Support:**\n`);
        if (info.support.chrome)
            content.appendMarkdown(`- Chrome: ${info.support.chrome}\n`);
        if (info.support.firefox)
            content.appendMarkdown(`- Firefox: ${info.support.firefox}\n`);
        if (info.support.safari)
            content.appendMarkdown(`- Safari: ${info.support.safari}\n`);
        if (info.support.edge)
            content.appendMarkdown(`- Edge: ${info.support.edge}\n`);
        return content;
    }
}
exports.BaselineHoverProvider = BaselineHoverProvider;
//# sourceMappingURL=BaselineHoverProvider.js.map