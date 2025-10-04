/**
 * AI Suggestions - AI-powered explanations, fixes, and learning content
 */
import { BaselineIssue, AISuggestion } from './types';
export declare class AISuggestionEngine {
    private suggestionTemplates;
    constructor();
    /**
     * Generate AI suggestion for a Baseline issue
     */
    generateSuggestion(issue: BaselineIssue): AISuggestion;
    /**
     * Generate explanation for the issue
     */
    private generateExplanation;
    /**
     * Generate alternative approaches
     */
    private generateAlternatives;
    /**
     * Generate auto-fix code
     */
    private generateAutoFix;
    /**
     * Generate learning snippet
     */
    private generateLearningSnippet;
    /**
     * Calculate confidence score
     */
    private calculateConfidence;
    /**
     * Get CSS alternatives
     */
    private getCSSAlternatives;
    /**
     * Get JavaScript alternatives
     */
    private getJSAlternatives;
    /**
     * Get HTML alternatives
     */
    private getHTMLAlternatives;
    /**
     * Generate CSS auto-fix
     */
    private generateCSSAutoFix;
    /**
     * Generate JavaScript auto-fix
     */
    private generateJSAutoFix;
    /**
     * Generate HTML auto-fix
     */
    private generateHTMLAutoFix;
    /**
     * Generate CSS learning snippet
     */
    private generateCSSLearningSnippet;
    /**
     * Generate JavaScript learning snippet
     */
    private generateJSLearningSnippet;
    /**
     * Generate HTML learning snippet
     */
    private generateHTMLLearningSnippet;
    /**
     * Initialize suggestion templates
     */
    private initializeTemplates;
}
//# sourceMappingURL=ai-suggestions.d.ts.map