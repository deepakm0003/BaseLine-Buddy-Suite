#!/usr/bin/env node
"use strict";
/**
 * Baseline Lint CLI - Command line tool for Baseline compliance checking
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const table_1 = require("table");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const core_1 = require("@baseline-buddy/core");
const core_2 = require("@baseline-buddy/core");
const program = new commander_1.Command();
program
    .name('baseline-lint')
    .description('CLI tool for Baseline compliance checking')
    .version('1.0.0');
program
    .argument('<path>', 'Path to scan (file or directory)')
    .option('-f, --format <format>', 'Output format (json, html, text)', 'text')
    .option('-o, --output <file>', 'Output file path')
    .option('--include <patterns...>', 'Include file patterns', ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html'])
    .option('--exclude <patterns...>', 'Exclude file patterns', ['**/node_modules/**', '**/dist/**', '**/build/**'])
    .option('--baseline-level <level>', 'Minimum baseline level (limited, newly, widely)', 'limited')
    .option('--enable-ai', 'Enable AI-powered suggestions', false)
    .option('--verbose', 'Verbose output', false)
    .option('--quiet', 'Quiet mode (errors only)', false)
    .action(async (scanPath, options) => {
    try {
        await runBaselineLint(scanPath, options);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error.message);
        process.exit(1);
    }
});
async function runBaselineLint(scanPath, options) {
    const analyzer = new core_1.WorkingFeatureAnalyzer();
    // Validate path
    if (!fs.existsSync(scanPath)) {
        throw new Error(`Path does not exist: ${scanPath}`);
    }
    const isDirectory = fs.statSync(scanPath).isDirectory();
    const basePath = isDirectory ? scanPath : path.dirname(scanPath);
    // Show spinner
    const spinner = (0, ora_1.default)('Scanning for Baseline issues...').start();
    try {
        // Scan for issues
        const scanOptions = {
            includePatterns: options.include,
            excludePatterns: options.exclude,
            baselineLevel: options.baselineLevel,
            enableAI: options.enableAi,
            outputFormat: options.format,
            verbose: options.verbose
        };
        const result = await analyzer.scanDirectory(scanPath, scanOptions);
        spinner.succeed(`Found ${result.issues.length} Baseline issues`);
        // Output results
        await outputResults(result, options, basePath);
        // Exit with appropriate code
        if (result.summary.errors > 0) {
            process.exit(1);
        }
        else if (result.summary.warnings > 0) {
            process.exit(2);
        }
        else {
            process.exit(0);
        }
    }
    catch (error) {
        spinner.fail('Scan failed');
        throw error;
    }
}
async function outputResults(result, options, basePath) {
    if (options.quiet && result.summary.errors === 0) {
        return;
    }
    switch (options.format) {
        case 'json':
            await outputJSON(result, options.output);
            break;
        case 'html':
            await outputHTML(result, options.output, basePath);
            break;
        case 'text':
        default:
            outputText(result, options, basePath);
            break;
    }
}
async function outputJSON(result, outputFile) {
    const jsonOutput = JSON.stringify(result, null, 2);
    if (outputFile) {
        await fs.writeFile(outputFile, jsonOutput);
        console.log(chalk_1.default.green(`Results written to ${outputFile}`));
    }
    else {
        console.log(jsonOutput);
    }
}
async function outputHTML(result, outputFile, basePath) {
    const html = generateHTMLReport(result, basePath);
    if (outputFile) {
        await fs.writeFile(outputFile, html);
        console.log(chalk_1.default.green(`HTML report written to ${outputFile}`));
    }
    else {
        console.log(html);
    }
}
function outputText(result, options, basePath) {
    // Summary
    console.log(chalk_1.default.bold.blue('\n📊 Baseline Compliance Report'));
    console.log('='.repeat(50));
    console.log(chalk_1.default.green(`📁 Files Scanned: ${result.files.scanned}`));
    console.log(chalk_1.default.yellow(`⚠️  Files with Issues: ${result.files.withIssues}`));
    console.log(chalk_1.default.bold('\n🔍 Issues Found:'));
    console.log(chalk_1.default.red(`  ❌ Errors: ${result.summary.errors}`));
    console.log(chalk_1.default.yellow(`  ⚠️  Warnings: ${result.summary.warnings}`));
    console.log(chalk_1.default.blue(`  ℹ️  Info: ${result.summary.info}`));
    console.log(chalk_1.default.bold('\n📈 Baseline Status:'));
    console.log(chalk_1.default.green(`  ✅ Widely Available: ${result.summary.baselineWidely}`));
    console.log(chalk_1.default.blue(`  🆕 Newly Available: ${result.summary.baselineNewly}`));
    console.log(chalk_1.default.red(`  ❌ Limited Support: ${result.summary.total - result.summary.baselineWidely - result.summary.baselineNewly}`));
    // Issues table
    if (result.issues.length > 0) {
        console.log(chalk_1.default.bold('\n📋 Issues Details:'));
        const tableData = [
            ['File', 'Type', 'Feature', 'Status', 'Severity', 'Message']
        ];
        result.issues.forEach((issue) => {
            const file = (0, core_2.formatFilePath)(issue.file || '', basePath);
            const type = issue.type.toUpperCase();
            const feature = issue.feature;
            const status = (0, core_2.formatBaselineStatus)(issue.baseline.baseline);
            const severity = getSeverityIcon(issue.severity);
            const message = issue.message;
            tableData.push([file, type, feature, status, severity, message]);
        });
        console.log((0, table_1.table)(tableData, {
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
        console.log(chalk_1.default.bold('\n🤖 AI Suggestions:'));
        result.issues.forEach((issue, index) => {
            if (issue.suggestion) {
                console.log(chalk_1.default.cyan(`\n${index + 1}. ${issue.feature}:`));
                console.log(chalk_1.default.gray(`   ${issue.suggestion}`));
            }
        });
    }
}
function getSeverityIcon(severity) {
    switch (severity) {
        case 'error':
            return chalk_1.default.red('❌');
        case 'warning':
            return chalk_1.default.yellow('⚠️');
        case 'info':
            return chalk_1.default.blue('ℹ️');
        default:
            return '❓';
    }
}
function generateHTMLReport(result, basePath) {
    const issues = result.issues.map((issue) => ({
        ...issue,
        file: (0, core_2.formatFilePath)(issue.file || '', basePath || ''),
        baselineStatus: (0, core_2.formatBaselineStatus)(issue.baseline.baseline)
    }));
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
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error(chalk_1.default.red('Uncaught Exception:'), error.message);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error(chalk_1.default.red('Unhandled Rejection:'), reason);
    process.exit(1);
});
program.parse();
//# sourceMappingURL=cli.js.map