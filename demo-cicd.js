#!/usr/bin/env node

/**
 * Baseline Buddy Suite - CI/CD Demo
 * Simulates GitHub Actions and GitLab CI integration
 */

const fs = require('fs');
const path = require('path');

// Mock Baseline data
const baselineFeatures = {
  'grid': {
    name: 'CSS Grid',
    baseline: 'widely',
    message: 'CSS Grid is Baseline Widely available. Safe to use.'
  },
  'subgrid': {
    name: 'CSS Subgrid',
    baseline: 'newly',
    message: 'CSS Subgrid is Baseline Newly available. Use with caution.',
    suggestion: 'Consider adding a fallback for older browsers.'
  },
  'word-break-auto-phrase': {
    name: 'word-break: auto-phrase',
    baseline: false,
    message: 'word-break: auto-phrase is not Baseline. Limited browser support.',
    suggestion: 'Use word-break: break-word for better compatibility.'
  },
  'has-selector': {
    name: ':has() selector',
    baseline: 'newly',
    message: ':has() selector is Baseline Newly available. Use with caution.',
    suggestion: 'Consider using JavaScript querySelector as a fallback.'
  },
  'container-queries': {
    name: 'Container Queries',
    baseline: 'newly',
    message: 'Container Queries are Baseline Newly available. Use with caution.',
    suggestion: 'Consider using media queries as a fallback.'
  }
};

function analyzeFile(filePath, content) {
  const issues = [];
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    // Check for CSS Grid
    if (line.includes('display: grid') || line.includes('display:grid')) {
      const feature = baselineFeatures['grid'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'info',
        message: feature.message,
        line: lineIndex + 1,
        file: filePath
      });
    }

    // Check for CSS Subgrid
    if (line.includes('subgrid')) {
      const feature = baselineFeatures['subgrid'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: feature.message,
        suggestion: feature.suggestion,
        line: lineIndex + 1,
        file: filePath
      });
    }

    // Check for word-break: auto-phrase
    if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
      const feature = baselineFeatures['word-break-auto-phrase'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'error',
        message: feature.message,
        suggestion: feature.suggestion,
        line: lineIndex + 1,
        file: filePath
      });
    }

    // Check for :has() selector
    if (line.includes(':has(')) {
      const feature = baselineFeatures['has-selector'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: feature.message,
        suggestion: feature.suggestion,
        line: lineIndex + 1,
        file: filePath
      });
    }

    // Check for container queries
    if (line.includes('@container')) {
      const feature = baselineFeatures['container-queries'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: feature.message,
        suggestion: feature.suggestion,
        line: lineIndex + 1,
        file: filePath
      });
    }
  });

  return issues;
}

function scanDirectory(dirPath) {
  const issues = [];
  let scannedFiles = 0;
  let filesWithIssues = 0;

  function scanDir(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (!['node_modules', 'dist', 'build', 'out'].includes(item)) {
            scanDir(itemPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm'].includes(ext)) {
            try {
              const content = fs.readFileSync(itemPath, 'utf-8');
              const fileIssues = analyzeFile(itemPath, content);
              
              if (fileIssues.length > 0) {
                issues.push(...fileIssues);
                filesWithIssues++;
              }
              scannedFiles++;
            } catch (error) {
              console.warn(`Failed to analyze ${itemPath}:`, error.message);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${currentPath}:`, error.message);
    }
  }

  scanDir(dirPath);
  
  return {
    issues,
    summary: {
      total: issues.length,
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length,
      baselineSafe: issues.filter(i => i.baseline === 'widely').length,
      baselineNewly: issues.filter(i => i.baseline === 'newly').length,
      baselineWidely: issues.filter(i => i.baseline === 'widely').length
    },
    files: {
      scanned: scannedFiles,
      withIssues: filesWithIssues
    }
  };
}

function generatePRComment(result) {
  let comment = `## 🏆 Baseline Compliance Check\n\n`;
  
  comment += `### 📊 Summary\n\n`;
  comment += `- **Files Scanned:** ${result.files.scanned}\n`;
  comment += `- **Files with Issues:** ${result.files.withIssues}\n`;
  comment += `- **Total Issues:** ${result.summary.total}\n`;
  comment += `- **Errors:** ${result.summary.errors}\n`;
  comment += `- **Warnings:** ${result.summary.warnings}\n`;
  comment += `- **Info:** ${result.summary.info}\n\n`;
  
  comment += `### 📈 Baseline Status\n\n`;
  comment += `- **Widely Available:** ${result.summary.baselineWidely}\n`;
  comment += `- **Newly Available:** ${result.summary.baselineNewly}\n`;
  comment += `- **Limited Support:** ${result.summary.total - result.summary.baselineWidely - result.summary.baselineNewly}\n\n`;
  
  if (result.issues.length > 0) {
    comment += `### 🔍 Issues Found\n\n`;
    
    result.issues.forEach((issue, index) => {
      const severity = getSeverityIcon(issue.severity);
      const file = path.relative(process.cwd(), issue.file);
      const line = issue.line || 0;
      
      comment += `${index + 1}. ${severity} **${issue.feature}**\n`;
      comment += `   - File: \`${file}:${line}\`\n`;
      comment += `   - Message: ${issue.message}\n`;
      if (issue.suggestion) {
        comment += `   - 💡 **Suggestion:** ${issue.suggestion}\n`;
      }
      comment += `\n`;
    });
  } else {
    comment += `### ✅ No Issues Found\n\n`;
    comment += `All features are Baseline compliant! 🎉\n\n`;
  }
  
  comment += `### 💡 Recommendations\n\n`;
  
  if (result.summary.errors > 0) {
    comment += `- **High Priority:** Fix ${result.summary.errors} error(s) to ensure browser compatibility\n`;
  }
  
  if (result.summary.warnings > 0) {
    comment += `- **Medium Priority:** Review ${result.summary.warnings} warning(s) and consider fallbacks\n`;
  }
  
  if (result.summary.baselineWidely > 0) {
    comment += `- **Good News:** ${result.summary.baselineWidely} feature(s) are widely supported! 🎉\n`;
  }
  
  comment += `\n---\n`;
  comment += `*This comment was generated by [Baseline Buddy](https://baseline-buddy.dev) - AI-powered Baseline compliance checking.*\n`;
  
  return comment;
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

function simulateGitHubActions() {
  console.log('🚀 GitHub Actions - Baseline Compliance Check');
  console.log('==============================================\n');

  console.log('::group::🔍 Scanning for Baseline issues');
  console.log('Running baseline-lint on workspace...\n');

  const result = scanDirectory('examples/basic-usage/src');
  
  console.log('::endgroup::');
  
  // Display results
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

  // Simulate GitHub Actions outputs
  console.log('🔧 Setting GitHub Actions outputs:');
  console.log(`::set-output name=total-issues::${result.summary.total}`);
  console.log(`::set-output name=errors::${result.summary.errors}`);
  console.log(`::set-output name=warnings::${result.summary.warnings}`);
  console.log(`::set-output name=info::${result.summary.info}`);
  console.log(`::set-output name=success::${result.summary.errors === 0}\n`);

  // Simulate PR comment
  console.log('💬 Generating PR comment...');
  const prComment = generatePRComment(result);
  
  console.log('📝 PR Comment Preview:');
  console.log('======================');
  console.log(prComment);

  // Simulate failure
  if (result.summary.errors > 0) {
    console.log('\n❌ Check failed due to Baseline compliance issues');
    console.log('::error::Baseline check failed with errors');
    return false;
  } else if (result.summary.warnings > 0) {
    console.log('\n⚠️  Check passed with warnings');
    return true;
  } else {
    console.log('\n✅ Check passed - all features are Baseline compliant!');
    return true;
  }
}

function simulateGitLabCI() {
  console.log('🦊 GitLab CI - Baseline Compliance Check');
  console.log('========================================\n');

  console.log('$ baseline-check');
  console.log('Scanning workspace for Baseline issues...\n');

  const result = scanDirectory('examples/basic-usage/src');
  
  // Display results
  console.log('📊 Baseline Compliance Report');
  console.log('=============================\n');
  
  console.log(`📁 Files Scanned: ${result.files.scanned}`);
  console.log(`⚠️  Files with Issues: ${result.files.withIssues}\n`);
  
  console.log('🔍 Issues Found:');
  console.log(`  ❌ Errors: ${result.summary.errors}`);
  console.log(`  ⚠️  Warnings: ${result.summary.warnings}`);
  console.log(`  ℹ️  Info: ${result.summary.info}\n`);

  // Simulate GitLab CI variables
  console.log('🔧 Setting GitLab CI variables:');
  console.log(`export BASELINE_TOTAL_ISSUES=${result.summary.total}`);
  console.log(`export BASELINE_ERRORS=${result.summary.errors}`);
  console.log(`export BASELINE_WARNINGS=${result.summary.warnings}`);
  console.log(`export BASELINE_INFO=${result.summary.info}`);
  console.log(`export BASELINE_SUCCESS=${result.summary.errors === 0}\n`);

  // Simulate MR comment
  console.log('💬 Generating MR comment...');
  const mrComment = generatePRComment(result);
  
  console.log('📝 MR Comment Preview:');
  console.log('======================');
  console.log(mrComment);

  // Simulate failure
  if (result.summary.errors > 0) {
    console.log('\n❌ Pipeline failed due to Baseline compliance issues');
    return false;
  } else {
    console.log('\n✅ Pipeline passed - all features are Baseline compliant!');
    return true;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const platform = args[0] || 'github';

  if (platform === 'github') {
    const success = simulateGitHubActions();
    process.exit(success ? 0 : 1);
  } else if (platform === 'gitlab') {
    const success = simulateGitLabCI();
    process.exit(success ? 0 : 1);
  } else {
    console.log('Usage: node demo-cicd.js [github|gitlab]');
    process.exit(1);
  }
}

main();
