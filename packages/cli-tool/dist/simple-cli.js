#!/usr/bin/env node
"use strict";
/**
 * Simple Baseline Lint CLI - Working demonstration
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
Object.defineProperty(exports, "__esModule", { value: true });
const simple_index_1 = require("@baseline-buddy/core/simple-index");
const fs = __importStar(require("fs"));
const args = process.argv.slice(2);
const scanPath = args[0] || '.';
const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : undefined;
async function runBaselineLint() {
    console.log('🏆 Baseline Buddy Suite - CLI Tool');
    console.log('=====================================\n');
    const analyzer = new simple_index_1.SimpleFeatureAnalyzer();
    try {
        console.log(`Scanning: ${scanPath}`);
        console.log('Looking for Baseline issues...\n');
        const result = await analyzer.scanDirectory(scanPath);
        // Display results
        displayResults(result, format, outputFile);
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
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}
function displayResults(result, format, outputFile) {
    // Summary
    console.log('📊 Baseline Compliance Report');
    console.log('=============================\n');
    console.log(`📁 Files Scanned: ${result.files.scanned}`);
    console.log(`⚠️  Files with Issues: ${result.files.withIssues}\n`);
    console.log('🔍 Issues Found:');
    console.log(`  ❌ Errors: ${result.summary.errors}`);
    console.log(`  ⚠️  Warnings: ${result.summary.warnings}`);
    console.log(`  ℹ️  Info: ${result.summary.info}\n`);
    console.log('📈 Baseline Status:');
    console.log(`  ✅ Widely Available: ${result.summary.baselineWidely}`);
    console.log(`  🆕 Newly Available: ${result.summary.baselineNewly}`);
    console.log(`  ❌ Limited Support: ${result.summary.total - result.summary.baselineWidely - result.summary.baselineNewly}\n`);
    // Issues details
    if (result.issues.length > 0) {
        console.log('📋 Issues Details:');
        console.log('==================\n');
        result.issues.forEach((issue, index) => {
            const severity = getSeverityIcon(issue.severity);
            const file = issue.file || 'Unknown';
            const line = issue.line || 0;
            console.log(`${index + 1}. ${severity} ${issue.feature}`);
            console.log(`   File: ${file}:${line}`);
            console.log(`   Message: ${issue.message}`);
            if (issue.suggestion) {
                console.log(`   💡 Suggestion: ${issue.suggestion}`);
            }
            console.log('');
        });
    }
    else {
        console.log('✅ No Baseline issues found! All features are compliant.\n');
    }
    // Output to file if requested
    if (outputFile) {
        if (format === 'json') {
            fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
            console.log(`📄 JSON report saved to: ${outputFile}`);
        }
        else if (format === 'html') {
            const html = generateHTMLReport(result);
            fs.writeFileSync(outputFile, html);
            console.log(`📄 HTML report saved to: ${outputFile}`);
        }
    }
}
function getSeverityIcon(severity) {
    switch (severity) {
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        case 'info':
            return 'ℹ️';
        default:
            return '❓';
    }
}
function generateHTMLReport(result) {
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
            ${result.issues.map(issue => `
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
// Run the CLI
runBaselineLint();
//# sourceMappingURL=simple-cli.js.map