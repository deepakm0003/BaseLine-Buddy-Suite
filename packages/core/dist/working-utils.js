"use strict";
/**
 * Working Utils - Production ready utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFilePath = formatFilePath;
exports.formatBaselineStatus = formatBaselineStatus;
exports.getSeverityIcon = getSeverityIcon;
exports.getSeverityColor = getSeverityColor;
exports.generateReportSummary = generateReportSummary;
exports.formatIssueDetails = formatIssueDetails;
exports.generateHTMLReport = generateHTMLReport;
exports.generateJSONReport = generateJSONReport;
exports.validateBaselineStatus = validateBaselineStatus;
exports.sortIssuesBySeverity = sortIssuesBySeverity;
exports.filterIssuesBySeverity = filterIssuesBySeverity;
exports.groupIssuesByFile = groupIssuesByFile;
function formatFilePath(filePath, basePath) {
    if (basePath) {
        return filePath.replace(basePath, '').replace(/^[\/\\]/, '');
    }
    return filePath;
}
function formatBaselineStatus(baseline) {
    switch (baseline) {
        case 'widely':
            return 'Widely Available';
        case 'newly':
            return 'Newly Available';
        case false:
            return 'Limited Support';
        default:
            return 'Unknown';
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
function getSeverityColor(severity) {
    switch (severity) {
        case 'error':
            return 'red';
        case 'warning':
            return 'yellow';
        case 'info':
            return 'blue';
        default:
            return 'gray';
    }
}
function generateReportSummary(result) {
    const { summary, files } = result;
    let summaryText = `📊 Baseline Compliance Report\n`;
    summaryText += `=============================\n\n`;
    summaryText += `📁 Files Scanned: ${files.scanned}\n`;
    summaryText += `⚠️  Files with Issues: ${files.withIssues}\n\n`;
    summaryText += `🔍 Issues Found:\n`;
    summaryText += `  ❌ Errors: ${summary.errors}\n`;
    summaryText += `  ⚠️  Warnings: ${summary.warnings}\n`;
    summaryText += `  ℹ️  Info: ${summary.info}\n\n`;
    summaryText += `📈 Baseline Status:\n`;
    summaryText += `  ✅ Widely Available: ${summary.baselineWidely}\n`;
    summaryText += `  🆕 Newly Available: ${summary.baselineNewly}\n`;
    summaryText += `  ❌ Limited Support: ${summary.total - summary.baselineWidely - summary.baselineNewly}\n`;
    return summaryText;
}
function formatIssueDetails(issue, index) {
    const icon = getSeverityIcon(issue.severity);
    const file = formatFilePath(issue.file || 'Unknown');
    const line = issue.line || 0;
    const column = issue.column || 0;
    let details = `${index + 1}. ${icon} ${issue.feature}\n`;
    details += `   📍 ${file}:${line}:${column}\n`;
    details += `   💬 ${issue.message}\n`;
    if (issue.suggestion) {
        details += `   💡 Suggestion: ${issue.suggestion}\n`;
    }
    if (issue.autoFix) {
        details += `   🔧 Auto-fix: ${issue.autoFix}\n`;
    }
    return details;
}
function generateHTMLReport(result) {
    const { issues, summary, files } = result;
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
                        <strong>File:</strong> ${formatFilePath(issue.file || 'Unknown')}<br>
                        <strong>Type:</strong> ${issue.type.toUpperCase()}<br>
                        <strong>Baseline Status:</strong> ${formatBaselineStatus(issue.baseline.baseline)}<br>
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
function generateJSONReport(result) {
    return JSON.stringify(result, null, 2);
}
function validateBaselineStatus(status) {
    return ['limited', 'newly', 'widely', false].includes(status);
}
function sortIssuesBySeverity(issues) {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
function filterIssuesBySeverity(issues, severity) {
    return issues.filter(issue => issue.severity === severity);
}
function groupIssuesByFile(issues) {
    return issues.reduce((groups, issue) => {
        const file = issue.file || 'Unknown';
        if (!groups[file]) {
            groups[file] = [];
        }
        groups[file].push(issue);
        return groups;
    }, {});
}
//# sourceMappingURL=working-utils.js.map