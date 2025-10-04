"use strict";
/**
 * AI Suggestions - AI-powered explanations, fixes, and learning content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISuggestionEngine = void 0;
class AISuggestionEngine {
    constructor() {
        this.suggestionTemplates = new Map();
        this.initializeTemplates();
    }
    /**
     * Generate AI suggestion for a Baseline issue
     */
    generateSuggestion(issue) {
        const explanation = this.generateExplanation(issue);
        const alternatives = this.generateAlternatives(issue);
        const autoFix = this.generateAutoFix(issue);
        const learningSnippet = this.generateLearningSnippet(issue);
        const confidence = this.calculateConfidence(issue);
        return {
            explanation,
            alternatives,
            autoFix,
            learningSnippet,
            confidence
        };
    }
    /**
     * Generate explanation for the issue
     */
    generateExplanation(issue) {
        const { feature, baseline, type } = issue;
        let explanation = `The ${feature} feature you're using has `;
        switch (baseline.baseline) {
            case false:
                explanation += `limited browser support. It's not yet part of the Baseline standard, `;
                explanation += `meaning it may not work consistently across all major browsers.`;
                break;
            case 'newly':
                explanation += `recently become Baseline Newly available. This means it has `;
                explanation += `interoperable support across major browsers, but it's relatively new.`;
                break;
            case 'widely':
                explanation += `excellent browser support and is Baseline Widely available. `;
                explanation += `You can use it confidently across all modern browsers.`;
                break;
            default:
                explanation += `unknown Baseline status.`;
        }
        // Add browser-specific information
        if (baseline.support) {
            const browsers = Object.entries(baseline.support)
                .map(([browser, version]) => `${browser} ${version}+`)
                .join(', ');
            explanation += ` Supported in: ${browsers}.`;
        }
        return explanation;
    }
    /**
     * Generate alternative approaches
     */
    generateAlternatives(issue) {
        const alternatives = [];
        const { feature, type, property, value } = issue;
        // CSS-specific alternatives
        if (type === 'css' && property) {
            alternatives.push(...this.getCSSAlternatives(property, value));
        }
        // JavaScript-specific alternatives
        if (type === 'javascript') {
            alternatives.push(...this.getJSAlternatives(feature));
        }
        // HTML-specific alternatives
        if (type === 'html') {
            alternatives.push(...this.getHTMLAlternatives(feature));
        }
        // Generic fallback suggestions
        if (alternatives.length === 0) {
            alternatives.push('Consider using a polyfill or feature detection', 'Provide a fallback for older browsers', 'Use progressive enhancement techniques');
        }
        return alternatives;
    }
    /**
     * Generate auto-fix code
     */
    generateAutoFix(issue) {
        const { type, property, value, feature } = issue;
        if (type === 'css' && property && value) {
            return this.generateCSSAutoFix(property, value);
        }
        if (type === 'javascript') {
            return this.generateJSAutoFix(feature);
        }
        if (type === 'html') {
            return this.generateHTMLAutoFix(feature);
        }
        return undefined;
    }
    /**
     * Generate learning snippet
     */
    generateLearningSnippet(issue) {
        const { feature, type } = issue;
        if (type === 'css') {
            return this.generateCSSLearningSnippet(feature);
        }
        if (type === 'javascript') {
            return this.generateJSLearningSnippet(feature);
        }
        if (type === 'html') {
            return this.generateHTMLLearningSnippet(feature);
        }
        return undefined;
    }
    /**
     * Calculate confidence score
     */
    calculateConfidence(issue) {
        let confidence = 0.5; // Base confidence
        // Higher confidence for widely supported features
        if (issue.baseline.baseline === 'widely') {
            confidence += 0.3;
        }
        else if (issue.baseline.baseline === 'newly') {
            confidence += 0.1;
        }
        // Higher confidence for well-documented features
        if (issue.baseline.support && Object.keys(issue.baseline.support).length >= 4) {
            confidence += 0.2;
        }
        return Math.min(confidence, 1.0);
    }
    /**
     * Get CSS alternatives
     */
    getCSSAlternatives(property, value) {
        const alternatives = [];
        switch (property) {
            case 'word-break':
                if (value === 'auto-phrase') {
                    alternatives.push('Use `word-break: break-word` for better compatibility');
                    alternatives.push('Consider `overflow-wrap: break-word` as an alternative');
                }
                break;
            case 'grid-template-columns':
                if (value?.includes('subgrid')) {
                    alternatives.push('Use regular grid with explicit column definitions');
                    alternatives.push('Consider CSS Grid with named grid lines');
                }
                break;
            case 'container-type':
                alternatives.push('Use media queries for responsive design');
                alternatives.push('Consider CSS custom properties for dynamic values');
                break;
        }
        return alternatives;
    }
    /**
     * Get JavaScript alternatives
     */
    getJSAlternatives(feature) {
        const alternatives = [];
        switch (feature) {
            case 'Promise.try':
                alternatives.push('Use `Promise.resolve().then()` pattern');
                alternatives.push('Use async/await with try-catch');
                break;
            case 'Array.prototype.toSorted':
                alternatives.push('Use `[...array].sort()` for immutable sorting');
                alternatives.push('Use `array.slice().sort()` for a copy');
                break;
        }
        return alternatives;
    }
    /**
     * Get HTML alternatives
     */
    getHTMLAlternatives(feature) {
        const alternatives = [];
        switch (feature) {
            case 'dialog':
                alternatives.push('Use a div with role="dialog" and ARIA attributes');
                alternatives.push('Use a modal library like Bootstrap or Material-UI');
                break;
            case 'popover':
                alternatives.push('Use a div with positioning and JavaScript');
                alternatives.push('Use a tooltip library');
                break;
        }
        return alternatives;
    }
    /**
     * Generate CSS auto-fix
     */
    generateCSSAutoFix(property, value) {
        switch (property) {
            case 'word-break':
                if (value === 'auto-phrase') {
                    return 'word-break: break-word; /* More compatible alternative */';
                }
                break;
        }
        return undefined;
    }
    /**
     * Generate JavaScript auto-fix
     */
    generateJSAutoFix(feature) {
        switch (feature) {
            case 'Promise.try':
                return 'Promise.resolve().then(() => { /* your code */ });';
            case 'Array.prototype.toSorted':
                return '[...array].sort(); // Creates a new sorted array';
        }
        return undefined;
    }
    /**
     * Generate HTML auto-fix
     */
    generateHTMLAutoFix(feature) {
        switch (feature) {
            case 'dialog':
                return `<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  <!-- Dialog content -->
</div>`;
        }
        return undefined;
    }
    /**
     * Generate CSS learning snippet
     */
    generateCSSLearningSnippet(feature) {
        return `/* Learning: ${feature} */
/* This feature ${feature} is part of modern CSS */
/* Check browser support before using in production */
/* Consider using feature queries: @supports (${feature}: value) */`;
    }
    /**
     * Generate JavaScript learning snippet
     */
    generateJSLearningSnippet(feature) {
        return `// Learning: ${feature}
// This feature is part of modern JavaScript
// Check browser support: if (typeof ${feature} !== 'undefined')
// Consider using polyfills for older browsers`;
    }
    /**
     * Generate HTML learning snippet
     */
    generateHTMLLearningSnippet(feature) {
        return `<!-- Learning: ${feature} -->
<!-- This HTML element is part of modern web standards -->
<!-- Check browser support before using -->
<!-- Consider progressive enhancement approach -->`;
    }
    /**
     * Initialize suggestion templates
     */
    initializeTemplates() {
        this.suggestionTemplates.set('css-property', 'The CSS property {property} has {status} support. {suggestion}');
        this.suggestionTemplates.set('js-api', 'The JavaScript API {api} has {status} support. {suggestion}');
        this.suggestionTemplates.set('html-element', 'The HTML element {element} has {status} support. {suggestion}');
    }
}
exports.AISuggestionEngine = AISuggestionEngine;
//# sourceMappingURL=ai-suggestions.js.map