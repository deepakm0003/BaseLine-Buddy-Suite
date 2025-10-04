/**
 * Working AI Suggestions - Production ready implementation
 */
import { WorkingBaselineIssue } from './working-baseline-detector';
export interface WorkingAISuggestion {
    explanation: string;
    alternatives: string[];
    autoFix?: string;
    learningSnippet?: string;
    confidence: number;
    reasoning: string;
}
export declare class WorkingAISuggestions {
    private suggestions;
    constructor();
    private initializeSuggestions;
    generateSuggestion(issue: WorkingBaselineIssue): WorkingAISuggestion;
    generateAutoFix(issue: WorkingBaselineIssue): string;
    generateLearningSnippet(issue: WorkingBaselineIssue): string;
    getAlternatives(issue: WorkingBaselineIssue): string[];
    getConfidence(issue: WorkingBaselineIssue): number;
    private getFeatureKey;
}
//# sourceMappingURL=working-ai-suggestions.d.ts.map