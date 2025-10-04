/**
 * Baseline Checker for CI/CD pipelines
 */

import { FeatureAnalyzer, ScanResult, ScanOptions } from '@baseline-buddy/core';
import * as fs from 'fs';
import * as path from 'path';

export interface CIConfig {
  includePatterns?: string[];
  excludePatterns?: string[];
  baselineLevel?: 'limited' | 'newly' | 'widely';
  failOnError?: boolean;
  failOnWarning?: boolean;
  outputFormat?: 'json' | 'text' | 'github';
  enableAI?: boolean;
}

export class BaselineChecker {
  private analyzer: FeatureAnalyzer;

  constructor() {
    this.analyzer = new FeatureAnalyzer();
  }

  /**
   * Check Baseline compliance for a directory
   */
  async checkDirectory(dirPath: string, config: CIConfig = {}): Promise<{
    success: boolean;
    result: ScanResult;
    summary: string;
  }> {
    const options: ScanOptions = {
      includePatterns: config.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html'],
      excludePatterns: config.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**'],
      baselineLevel: config.baselineLevel || 'limited',
      enableAI: config.enableAI || false,
      outputFormat: config.outputFormat || 'text',
      verbose: true
    };

    try {
      const result = await this.analyzer.scanDirectory(dirPath, options);
      
      // Determine if check should fail
      const shouldFail = this.shouldFailCheck(result, config);
      
      // Generate summary
      const summary = this.generateSummary(result, config);
      
      return {
        success: !shouldFail,
        result,
        summary
      };
    } catch (error) {
      throw new Error(`Baseline check failed: ${error.message}`);
    }
  }

  /**
   * Check Baseline compliance for specific files
   */
  async checkFiles(filePaths: string[], config: CIConfig = {}): Promise<{
    success: boolean;
    result: ScanResult;
    summary: string;
  }> {
    const issues = [];
    let scannedFiles = 0;
    let filesWithIssues = 0;

    for (const filePath of filePaths) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileIssues = await this.analyzer.analyzeFile(filePath, content, config);
        
        if (fileIssues.length > 0) {
          issues.push(...fileIssues);
          filesWithIssues++;
        }
        scannedFiles++;
      } catch (error) {
        console.warn(`Failed to analyze ${filePath}:`, error);
      }
    }

    const result: ScanResult = {
      issues,
      summary: {
        total: issues.length,
        errors: issues.filter(i => i.severity === 'error').length,
        warnings: issues.filter(i => i.severity === 'warning').length,
        info: issues.filter(i => i.severity === 'info').length,
        baselineSafe: issues.filter(i => i.baseline.baseline === 'widely').length,
        baselineNewly: issues.filter(i => i.baseline.baseline === 'newly').length,
        baselineWidely: issues.filter(i => i.baseline.baseline === 'widely').length
      },
      files: {
        scanned: scannedFiles,
        withIssues: filesWithIssues
      }
    };

    const shouldFail = this.shouldFailCheck(result, config);
    const summary = this.generateSummary(result, config);

    return {
      success: !shouldFail,
      result,
      summary
    };
  }

  /**
   * Determine if the check should fail based on configuration
   */
  private shouldFailCheck(result: ScanResult, config: CIConfig): boolean {
    if (config.failOnError && result.summary.errors > 0) {
      return true;
    }
    
    if (config.failOnWarning && result.summary.warnings > 0) {
      return true;
    }
    
    return false;
  }

  /**
   * Generate summary text for the check
   */
  private generateSummary(result: ScanResult, config: CIConfig): string {
    const { summary, files } = result;
    
    let summaryText = `📊 Baseline Compliance Check Results\n`;
    summaryText += `=====================================\n\n`;
    
    summaryText += `📁 Files Scanned: ${files.scanned}\n`;
    summaryText += `⚠️  Files with Issues: ${files.withIssues}\n\n`;
    
    summaryText += `🔍 Issues Found: ${summary.total}\n`;
    summaryText += `  ❌ Errors: ${summary.errors}\n`;
    summaryText += `  ⚠️  Warnings: ${summary.warnings}\n`;
    summaryText += `  ℹ️  Info: ${summary.info}\n\n`;
    
    summaryText += `📈 Baseline Status:\n`;
    summaryText += `  ✅ Widely Available: ${summary.baselineWidely}\n`;
    summaryText += `  🆕 Newly Available: ${summary.baselineNewly}\n`;
    summaryText += `  ❌ Limited Support: ${summary.total - summary.baselineWidely - summary.baselineNewly}\n\n`;
    
    if (config.failOnError && summary.errors > 0) {
      summaryText += `❌ Check failed due to ${summary.errors} error(s)\n`;
    } else if (config.failOnWarning && summary.warnings > 0) {
      summaryText += `⚠️  Check failed due to ${summary.warnings} warning(s)\n`;
    } else {
      summaryText += `✅ Check passed\n`;
    }
    
    return summaryText;
  }

  /**
   * Generate GitHub Actions output
   */
  generateGitHubOutput(result: ScanResult, config: CIConfig): void {
    const { summary } = result;
    
    // Set GitHub Actions outputs
    if (process.env.GITHUB_OUTPUT) {
      const output = [
        `total=${summary.total}`,
        `errors=${summary.errors}`,
        `warnings=${summary.warnings}`,
        `info=${summary.info}`,
        `baseline_widely=${summary.baselineWidely}`,
        `baseline_newly=${summary.baselineNewly}`,
        `baseline_limited=${summary.total - summary.baselineWidely - summary.baselineNewly}`
      ].join('\n');
      
      fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
    }
    
    // Set GitHub Actions step summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      const summaryText = this.generateSummary(result, config);
      fs.writeFileSync(process.env.GITHUB_STEP_SUMMARY, summaryText);
    }
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(result: ScanResult, outputPath: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: result.summary,
      files: result.files,
      issues: result.issues.map(issue => ({
        type: issue.type,
        feature: issue.feature,
        property: issue.property,
        value: issue.value,
        baseline: issue.baseline,
        severity: issue.severity,
        message: issue.message,
        suggestion: issue.suggestion,
        line: issue.line,
        column: issue.column,
        file: issue.file
      }))
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(result: ScanResult, outputPath: string): void {
    const html = this.generateHTMLContent(result);
    fs.writeFileSync(outputPath, html);
  }

  private generateHTMLContent(result: ScanResult): string {
    const { summary, files, issues } = result;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baseline Compliance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .number { font-size: 2em; font-weight: bold; }
        .issues { padding: 0 30px 30px; }
        .issue { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #ddd; }
        .issue.error { border-left-color: #dc3545; }
        .issue.warning { border-left-color: #ffc107; }
        .issue.info { border-left-color: #17a2b8; }
        .issue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .issue-title { font-weight: bold; color: #333; }
        .issue-severity { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .severity-error { background: #dc3545; color: white; }
        .severity-warning { background: #ffc107; color: #333; }
        .severity-info { background: #17a2b8; color: white; }
        .issue-details { color: #666; font-size: 0.9em; }
        .issue-suggestion { background: #e3f2fd; padding: 10px; border-radius: 4px; margin-top: 10px; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 Baseline Compliance Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Files Scanned</h3>
                <div class="number">${files.scanned}</div>
            </div>
            <div class="summary-card">
                <h3>Files with Issues</h3>
                <div class="number">${files.withIssues}</div>
            </div>
            <div class="summary-card">
                <h3>Total Issues</h3>
                <div class="number">${summary.total}</div>
            </div>
            <div class="summary-card">
                <h3>Errors</h3>
                <div class="number" style="color: #dc3545;">${summary.errors}</div>
            </div>
            <div class="summary-card">
                <h3>Warnings</h3>
                <div class="number" style="color: #ffc107;">${summary.warnings}</div>
            </div>
            <div class="summary-card">
                <h3>Info</h3>
                <div class="number" style="color: #17a2b8;">${summary.info}</div>
            </div>
        </div>
        
        <div class="issues">
            <h2>Issues Found</h2>
            ${issues.map(issue => `
                <div class="issue ${issue.severity}">
                    <div class="issue-header">
                        <div class="issue-title">${issue.feature}</div>
                        <div class="issue-severity severity-${issue.severity}">${issue.severity.toUpperCase()}</div>
                    </div>
                    <div class="issue-details">
                        <strong>File:</strong> ${issue.file}<br>
                        <strong>Type:</strong> ${issue.type.toUpperCase()}<br>
                        <strong>Baseline Status:</strong> ${issue.baseline.baseline}<br>
                        <strong>Message:</strong> ${issue.message}
                        ${issue.suggestion ? `<div class="issue-suggestion"><strong>Suggestion:</strong> ${issue.suggestion}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}
