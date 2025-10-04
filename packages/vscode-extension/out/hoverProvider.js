"use strict";
/**
 * Hover Provider for Baseline information
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
exports.BaselineHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
class BaselineHoverProvider {
    constructor(detector) {
        this.detector = detector;
    }
    async provideHover(document, position, token) {
        const config = vscode.workspace.getConfiguration('baseline-buddy');
        if (!config.get('showHoverInfo', true)) {
            return undefined;
        }
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }
        const word = document.getText(wordRange);
        const feature = this.detectFeature(document, position, word);
        if (!feature) {
            return undefined;
        }
        const baselineStatus = this.detector.getBaselineStatus(feature);
        if (!baselineStatus) {
            return undefined;
        }
        const hoverContent = this.createHoverContent(feature, baselineStatus);
        return new vscode.Hover(hoverContent, wordRange);
    }
    detectFeature(document, position, word) {
        const language = document.languageId;
        switch (language) {
            case 'css':
                return this.detectCSSFeature(document, position, word);
            case 'javascript':
            case 'typescript':
                return this.detectJSFeature(document, position, word);
            case 'html':
                return this.detectHTMLFeature(document, position, word);
            default:
                return null;
        }
    }
    detectCSSFeature(document, position, word) {
        const line = document.lineAt(position.line).text;
        const beforeCursor = line.substring(0, position.character);
        const afterCursor = line.substring(position.character);
        // Check if we're in a CSS property
        if (beforeCursor.includes(':') && !afterCursor.includes(':')) {
            const propertyMatch = beforeCursor.match(/(\w+):\s*$/);
            if (propertyMatch) {
                return `css.properties.${propertyMatch[1]}`;
            }
        }
        // Check if we're in a CSS value
        if (beforeCursor.includes(':') && afterCursor.includes(';')) {
            const propertyMatch = beforeCursor.match(/(\w+):\s*([^;]*)$/);
            if (propertyMatch) {
                const property = propertyMatch[1];
                const value = propertyMatch[2].trim();
                if (value === word) {
                    return `css.properties.${property}.${word}`;
                }
            }
        }
        return null;
    }
    detectJSFeature(document, position, word) {
        // Simple detection for common JS APIs
        const jsAPIs = [
            'fetch', 'Promise', 'async', 'await', 'Map', 'Set', 'WeakMap', 'WeakSet',
            'Symbol', 'Proxy', 'Reflect', 'Array.from', 'Object.assign'
        ];
        if (jsAPIs.includes(word)) {
            return word;
        }
        return null;
    }
    detectHTMLFeature(document, position, word) {
        const line = document.lineAt(position.line).text;
        // Check if we're in an HTML tag
        if (line.includes(`<${word}`) || line.includes(`</${word}`)) {
            return word;
        }
        // Check if we're in an HTML attribute
        if (line.includes('=') && line.includes(word)) {
            const attributeMatch = line.match(/(\w+)=/);
            if (attributeMatch) {
                return `${word}.${attributeMatch[1]}`;
            }
        }
        return null;
    }
    createHoverContent(feature, baselineStatus) {
        const content = new vscode.MarkdownString();
        // Feature name
        content.appendMarkdown(`**${feature}**\n\n`);
        // Baseline status
        const statusText = this.getBaselineStatusText(baselineStatus.baseline);
        const statusColor = this.getBaselineStatusColor(baselineStatus.baseline);
        content.appendMarkdown(`**Baseline Status:** ${statusText}\n\n`);
        // Browser support
        if (baselineStatus.support) {
            content.appendMarkdown('**Browser Support:**\n');
            const browsers = Object.entries(baselineStatus.support)
                .map(([browser, version]) => `- ${browser}: ${version}+`)
                .join('\n');
            content.appendMarkdown(browsers);
            content.appendMarkdown('\n\n');
        }
        // Dates
        if (baselineStatus.baseline_low_date) {
            content.appendMarkdown(`**Newly Available:** ${new Date(baselineStatus.baseline_low_date).toLocaleDateString()}\n`);
        }
        if (baselineStatus.baseline_high_date) {
            content.appendMarkdown(`**Widely Available:** ${new Date(baselineStatus.baseline_high_date).toLocaleDateString()}\n`);
        }
        // Recommendations
        if (baselineStatus.baseline === false) {
            content.appendMarkdown('\n⚠️ **Recommendation:** This feature has limited browser support. Consider using a fallback or alternative approach.');
        }
        else if (baselineStatus.baseline === 'newly') {
            content.appendMarkdown('\n💡 **Recommendation:** This feature is newly available. Consider adding a fallback for older browsers.');
        }
        else if (baselineStatus.baseline === 'widely') {
            content.appendMarkdown('\n✅ **Recommendation:** This feature is widely supported and safe to use.');
        }
        return content;
    }
    getBaselineStatusText(baseline) {
        switch (baseline) {
            case 'widely':
                return '🟢 Widely Available';
            case 'newly':
                return '🟡 Newly Available';
            case false:
                return '🔴 Limited Support';
            default:
                return '⚪ Unknown';
        }
    }
    getBaselineStatusColor(baseline) {
        switch (baseline) {
            case 'widely':
                return '#10b981';
            case 'newly':
                return '#3b82f6';
            case false:
                return '#ef4444';
            default:
                return '#6b7280';
        }
    }
}
exports.BaselineHoverProvider = BaselineHoverProvider;
//# sourceMappingURL=hoverProvider.js.map