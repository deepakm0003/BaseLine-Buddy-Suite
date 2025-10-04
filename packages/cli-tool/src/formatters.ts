/**
 * Formatters for different output formats
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import { table } from 'table';
import { WorkingScanResult } from '@baseline-buddy/core';

export class Formatter {
  /**
   * Format results as JSON
   */
  static async formatJSON(result: WorkingScanResult, outputFile?: string): Promise<void> {
    const jsonOutput = JSON.stringify(result, null, 2);
    
    if (outputFile) {
      await fs.writeFile(outputFile, jsonOutput);
      console.log(chalk.green(`Results written to ${outputFile}`));
    } else {
      console.log(jsonOutput);
    }
  }

  /**
   * Format results as HTML
   */
  static async formatHTML(result: WorkingScanResult, outputFile?: string): Promise<void> {
    const html = this.generateHTMLReport(result);
    
    if (outputFile) {
      await fs.writeFile(outputFile, html);
      console.log(chalk.green(`HTML report written to ${outputFile}`));
    } else {
      console.log(html);
    }
  }

  /**
   * Format results as text
   */
  static formatText(result: WorkingScanResult, options: any = {}): void {
    // Summary
    console.log(chalk.bold.blue('\n📊 Baseline Compliance Report'));
    console.log('='.repeat(50));
    
    console.log(chalk.green(`📁 Files Scanned: ${result.files.scanned}`));
    console.log(chalk.yellow(`⚠️  Files with Issues: ${result.files.withIssues}`));
    
    console.log(chalk.bold('\n🔍 Issues Found:'));
    console.log(chalk.red(`  ❌ Errors: ${result.summary.errors}`));
    console.log(chalk.yellow(`  ⚠️  Warnings: ${result.summary.warnings}`));
    console.log(chalk.blue(`  ℹ️  Info: ${result.summary.info}`));
    
    console.log(chalk.bold('\n📈 Baseline Status:'));
    console.log(chalk.green(`  ✅ Widely Available: ${result.summary.baselineWidely}`));
    console.log(chalk.blue(`  🆕 Newly Available: ${result.summary.baselineNewly}`));
    console.log(chalk.red(`  ❌ Limited Support: ${result.summary.total - result.summary.baselineWidely - result.summary.baselineNewly}`));

    // Issues table
    if (result.issues.length > 0) {
      console.log(chalk.bold('\n📋 Issues Details:'));
      
      const tableData = [
        ['File', 'Type', 'Feature', 'Status', 'Severity', 'Message']
      ];

      result.issues.forEach((issue) => {
        const file = issue.file || 'Unknown';
        const type = issue.type.toUpperCase();
        const feature = issue.feature;
        const status = this.formatBaselineStatus(issue.baseline.baseline);
        const severity = this.getSeverityIcon(issue.severity);
        const message = issue.message;

        tableData.push([file, type, feature, status, severity, message]);
      });

      console.log(table(tableData, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        }
      }));
    }

    // Suggestions
    if (options.enableAi && result.issues.length > 0) {
      console.log(chalk.bold('\n🤖 AI Suggestions:'));
      result.issues.forEach((issue, index) => {
        if (issue.suggestion) {
          console.log(chalk.cyan(`\n${index + 1}. ${issue.feature}:`));
          console.log(chalk.gray(`   ${issue.suggestion}`));
        }
      });
    }
  }

  /**
   * Format Baseline status
   */
  private static formatBaselineStatus(baseline: string | false): string {
    switch (baseline) {
      case 'widely':
        return chalk.green('Widely Available');
      case 'newly':
        return chalk.blue('Newly Available');
      case false:
        return chalk.red('Limited Support');
      default:
        return chalk.gray('Unknown');
    }
  }

  /**
   * Get severity icon
   */
  private static getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error':
        return chalk.red('❌');
      case 'warning':
        return chalk.yellow('⚠️');
      case 'info':
        return chalk.blue('ℹ️');
      default:
        return '❓';
    }
  }

  /**
   * Generate HTML report
   */
  private static generateHTMLReport(result: WorkingScanResult): string {
    const issues = result.issues.map((issue) => ({
      ...issue,
      baselineStatus: this.formatBaselineStatus(issue.baseline.baseline)
    }));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baseline Compliance Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 8px 8px 0 0; 
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            padding: 30px; 
        }
        .summary-card { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
        }
        .summary-card h3 { 
            margin: 0 0 10px 0; 
            color: #333; 
        }
        .summary-card .number { 
            font-size: 2em; 
            font-weight: bold; 
        }
        .issues { 
            padding: 0 30px 30px; 
        }
        .issue { 
            background: #f8f9fa; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #ddd; 
        }
        .issue.error { 
            border-left-color: #dc3545; 
        }
        .issue.warning { 
            border-left-color: #ffc107; 
        }
        .issue.info { 
            border-left-color: #17a2b8; 
        }
        .issue-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 10px; 
        }
        .issue-title { 
            font-weight: bold; 
            color: #333; 
        }
        .issue-severity { 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 0.8em; 
            font-weight: bold; 
        }
        .severity-error { 
            background: #dc3545; 
            color: white; 
        }
        .severity-warning { 
            background: #ffc107; 
            color: #333; 
        }
        .severity-info { 
            background: #17a2b8; 
            color: white; 
        }
        .issue-details { 
            color: #666; 
            font-size: 0.9em; 
        }
        .issue-suggestion { 
            background: #e3f2fd; 
            padding: 10px; 
            border-radius: 4px; 
            margin-top: 10px; 
            font-style: italic; 
        }
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
                <div class="number">${result.files.scanned}</div>
            </div>
            <div class="summary-card">
                <h3>Files with Issues</h3>
                <div class="number">${result.files.withIssues}</div>
            </div>
            <div class="summary-card">
                <h3>Total Issues</h3>
                <div class="number">${result.summary.total}</div>
            </div>
            <div class="summary-card">
                <h3>Errors</h3>
                <div class="number" style="color: #dc3545;">${result.summary.errors}</div>
            </div>
            <div class="summary-card">
                <h3>Warnings</h3>
                <div class="number" style="color: #ffc107;">${result.summary.warnings}</div>
            </div>
            <div class="summary-card">
                <h3>Info</h3>
                <div class="number" style="color: #17a2b8;">${result.summary.info}</div>
            </div>
        </div>
        
        <div class="issues">
            <h2>Issues Found</h2>
            ${issues.map((issue) => `
                <div class="issue ${issue.severity}">
                    <div class="issue-header">
                        <div class="issue-title">${issue.feature}</div>
                        <div class="issue-severity severity-${issue.severity}">${issue.severity.toUpperCase()}</div>
                    </div>
                    <div class="issue-details">
                        <strong>File:</strong> ${issue.file}<br>
                        <strong>Type:</strong> ${issue.type.toUpperCase()}<br>
                        <strong>Baseline Status:</strong> ${issue.baselineStatus}<br>
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

