"use strict";
/**
 * Working AI Suggestions - Production ready implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingAISuggestions = void 0;
class WorkingAISuggestions {
    constructor() {
        this.suggestions = new Map();
        this.initializeSuggestions();
    }
    initializeSuggestions() {
        // CSS Grid suggestions
        this.suggestions.set('grid', {
            explanation: 'CSS Grid is a powerful layout system that provides two-dimensional grid-based layouts.',
            alternatives: [
                'Use Flexbox for one-dimensional layouts',
                'Use CSS Float for simple layouts',
                'Use CSS Table for table-like layouts'
            ],
            autoFix: '/* CSS Grid is widely supported and safe to use */',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout',
            confidence: 0.95,
            reasoning: 'CSS Grid has been widely available since 2017 and is supported by all modern browsers.'
        });
        // CSS Subgrid suggestions
        this.suggestions.set('subgrid', {
            explanation: 'CSS Subgrid allows grid items to inherit the grid definition of their parent grid container.',
            alternatives: [
                'Use explicit grid definitions for each grid item',
                'Use CSS Grid with manual column/row definitions',
                'Use Flexbox as a fallback'
            ],
            autoFix: '/* Consider using explicit grid definitions as fallback */\n.grid-item {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid',
            confidence: 0.85,
            reasoning: 'CSS Subgrid is newly available and may need fallbacks for older browsers.'
        });
        // Container Queries suggestions
        this.suggestions.set('container-queries', {
            explanation: 'Container Queries allow you to apply styles based on the size of a containing element.',
            alternatives: [
                'Use Media Queries for viewport-based styling',
                'Use JavaScript to detect container size',
                'Use CSS Custom Properties with JavaScript'
            ],
            autoFix: '/* Use media queries as fallback */\n@media (min-width: 300px) {\n  .card {\n    /* styles */\n  }\n}',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries',
            confidence: 0.80,
            reasoning: 'Container Queries are newly available and should have media query fallbacks.'
        });
        // word-break: auto-phrase suggestions
        this.suggestions.set('word-break-auto-phrase', {
            explanation: 'word-break: auto-phrase is a new value that provides better text breaking for phrases.',
            alternatives: [
                'Use word-break: break-word for better compatibility',
                'Use word-break: break-all for aggressive breaking',
                'Use overflow-wrap: break-word as fallback'
            ],
            autoFix: 'word-break: break-word; /* More compatible alternative */',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/word-break',
            confidence: 0.90,
            reasoning: 'word-break: auto-phrase has limited browser support and should be replaced with a more compatible alternative.'
        });
        // :has() selector suggestions
        this.suggestions.set('has-selector', {
            explanation: 'The :has() pseudo-class allows you to select elements based on their descendants.',
            alternatives: [
                'Use JavaScript querySelector with :has() support detection',
                'Use CSS classes with JavaScript toggling',
                'Use CSS :not() with complex selectors'
            ],
            autoFix: '/* Use JavaScript as fallback */\nif (CSS.supports("selector(:has(*))")) {\n  /* CSS :has() is supported */\n} else {\n  /* Use JavaScript alternative */\n}',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has',
            confidence: 0.75,
            reasoning: ':has() selector is newly available and should have JavaScript fallbacks.'
        });
        // CSS Nesting suggestions
        this.suggestions.set('css-nesting', {
            explanation: 'CSS Nesting allows you to nest CSS rules inside other rules, similar to Sass.',
            alternatives: [
                'Use CSS preprocessors like Sass or Less',
                'Use CSS-in-JS solutions',
                'Use separate CSS classes'
            ],
            autoFix: '/* Use separate classes instead of nesting */\n.parent {\n  /* parent styles */\n}\n.parent .child {\n  /* child styles */\n}',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Nesting_Module',
            confidence: 0.70,
            reasoning: 'CSS Nesting is newly available and may need preprocessor fallbacks.'
        });
        // HTML Dialog suggestions
        this.suggestions.set('dialog-element', {
            explanation: 'The HTML dialog element provides a native way to create modal dialogs.',
            alternatives: [
                'Use a div with role="dialog" and ARIA attributes',
                'Use a third-party modal library',
                'Use CSS-only modal solutions'
            ],
            autoFix: '<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">\n  <h2 id="dialog-title">Dialog Title</h2>\n  <!-- dialog content -->\n</div>',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog',
            confidence: 0.85,
            reasoning: 'HTML dialog element is newly available and should have ARIA fallbacks.'
        });
        // Array.toSorted suggestions
        this.suggestions.set('array-tosorted', {
            explanation: 'Array.prototype.toSorted() creates a new sorted array without mutating the original.',
            alternatives: [
                'Use Array.prototype.sort() with spread operator',
                'Use lodash sortBy function',
                'Use a custom sorting function'
            ],
            autoFix: 'const sorted = [...array].sort((a, b) => a - b); // Non-mutating sort',
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted',
            confidence: 0.80,
            reasoning: 'Array.toSorted is newly available and should have spread operator fallbacks.'
        });
    }
    generateSuggestion(issue) {
        const featureKey = this.getFeatureKey(issue.feature);
        const suggestion = this.suggestions.get(featureKey);
        if (suggestion) {
            return suggestion;
        }
        // Generate generic suggestion
        return {
            explanation: `This ${issue.type} feature has ${issue.baseline.baseline === false ? 'limited' : issue.baseline.baseline} browser support.`,
            alternatives: [
                'Consider using a fallback approach',
                'Add feature detection before using',
                'Provide alternative styling/functionality'
            ],
            autoFix: `/* Consider adding fallback for ${issue.feature} */`,
            learningSnippet: 'https://developer.mozilla.org/en-US/docs/Web/API',
            confidence: 0.60,
            reasoning: 'Generic suggestion based on Baseline status.'
        };
    }
    generateAutoFix(issue) {
        const suggestion = this.generateSuggestion(issue);
        return suggestion.autoFix || `/* Auto-fix for ${issue.feature} */`;
    }
    generateLearningSnippet(issue) {
        const suggestion = this.generateSuggestion(issue);
        return suggestion.learningSnippet || 'https://developer.mozilla.org/en-US/docs/Web/API';
    }
    getAlternatives(issue) {
        const suggestion = this.generateSuggestion(issue);
        return suggestion.alternatives;
    }
    getConfidence(issue) {
        const suggestion = this.generateSuggestion(issue);
        return suggestion.confidence;
    }
    getFeatureKey(feature) {
        const keyMap = {
            'CSS Grid': 'grid',
            'CSS Subgrid': 'subgrid',
            'Container Queries': 'container-queries',
            'word-break: auto-phrase': 'word-break-auto-phrase',
            ':has() selector': 'has-selector',
            'CSS Nesting': 'css-nesting',
            'HTML Dialog Element': 'dialog-element',
            'Array.prototype.toSorted': 'array-tosorted'
        };
        return keyMap[feature] || feature.toLowerCase().replace(/\s+/g, '-');
    }
}
exports.WorkingAISuggestions = WorkingAISuggestions;
//# sourceMappingURL=working-ai-suggestions.js.map