/**
 * Working Utils - Production ready utility functions
 */
import { WorkingBaselineIssue, WorkingScanResult } from './working-baseline-detector';
export declare function formatFilePath(filePath: string, basePath?: string): string;
export declare function formatBaselineStatus(baseline: string | false): string;
export declare function getSeverityIcon(severity: string): string;
export declare function getSeverityColor(severity: string): string;
export declare function generateReportSummary(result: WorkingScanResult): string;
export declare function formatIssueDetails(issue: WorkingBaselineIssue, index: number): string;
export declare function generateHTMLReport(result: WorkingScanResult): string;
export declare function generateJSONReport(result: WorkingScanResult): string;
export declare function validateBaselineStatus(status: string | false): boolean;
export declare function sortIssuesBySeverity(issues: WorkingBaselineIssue[]): WorkingBaselineIssue[];
export declare function filterIssuesBySeverity(issues: WorkingBaselineIssue[], severity: string): WorkingBaselineIssue[];
export declare function groupIssuesByFile(issues: WorkingBaselineIssue[]): {
    [file: string]: WorkingBaselineIssue[];
};
//# sourceMappingURL=working-utils.d.ts.map