/**
 * AI Auto-Fix Engine - Intelligent code analysis and automatic fixes
 *
 * This module provides AI-powered automatic fixes for Baseline compliance issues
 * with detailed explanations and smart code replacements.
 */
export interface AutoFixSuggestion {
    id: string;
    originalCode: string;
    fixedCode: string;
    explanation: string;
    confidence: number;
    baselineStatus: 'widely' | 'newly' | 'limited';
    browserSupport: {
        chrome: string;
        firefox: string;
        safari: string;
        edge: string;
    };
    alternatives: string[];
    reasoning: string;
    category: 'css' | 'javascript' | 'html';
    severity: 'error' | 'warning' | 'info';
}
export interface FixContext {
    filePath: string;
    lineNumber: number;
    columnNumber: number;
    fileType: 'css' | 'js' | 'ts' | 'jsx' | 'tsx' | 'html';
    surroundingCode: string;
    projectType: 'react' | 'vue' | 'angular' | 'vanilla' | 'node';
}
export declare class AIAutoFixEngine {
    private fixDatabase;
    private confidenceThreshold;
    constructor();
    /**
     * Analyze code and generate automatic fixes
     */
    analyzeAndFix(code: string, context: FixContext): Promise<AutoFixSuggestion[]>;
    /**
     * Apply a specific fix to code
     */
    applyFix(code: string, fix: AutoFixSuggestion, context: FixContext): string;
    /**
     * Get detailed explanation for a fix
     */
    getFixExplanation(fix: AutoFixSuggestion): string;
    /**
     * Detect Baseline issues in code
     */
    private detectBaselineIssues;
    /**
     * Generate fix for a specific issue
     */
    private generateFix;
    /**
     * Select the best fix based on context
     */
    private selectBestFix;
    /**
     * Initialize the fix database with comprehensive fixes
     */
    private initializeFixDatabase;
    /**
     * Add a fix to the database
     */
    private addFix;
    /**
     * Get all available fixes for a specific issue
     */
    getAvailableFixes(issue: string, fileType: string): AutoFixSuggestion[];
    /**
     * Get fix statistics
     */
    getFixStatistics(): {
        totalFixes: number;
        categories: Record<string, number>;
    };
}
export default AIAutoFixEngine;
//# sourceMappingURL=ai-auto-fix-engine.d.ts.map