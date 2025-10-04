#!/usr/bin/env node

/**
 * Baseline Buddy Suite - VS Code Extension Demo
 * Simulates VS Code extension functionality
 */

const fs = require('fs');
const path = require('path');

// Mock Baseline data
const baselineFeatures = {
  'grid': {
    name: 'CSS Grid',
    baseline: 'widely',
    message: 'CSS Grid is Baseline Widely available. Safe to use.',
    suggestion: 'This feature has excellent browser support.'
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

function analyzeCode(content, filePath) {
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
        suggestion: feature.suggestion,
        line: lineIndex + 1,
        column: 1,
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
        column: 1,
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
        column: 1,
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
        column: 1,
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
        column: 1,
        file: filePath
      });
    }
  });

  return issues;
}

function simulateVSCodeExtension() {
  console.log('🔧 Baseline Buddy VS Code Extension Demo');
  console.log('==========================================\n');

  // Simulate opening a file
  const filePath = 'examples/basic-usage/src/styles.css';
  console.log(`📁 Opening file: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('📄 File loaded successfully\n');

    // Simulate real-time analysis
    console.log('🔍 Analyzing code for Baseline issues...\n');
    
    const issues = analyzeCode(content, filePath);
    
    if (issues.length > 0) {
      console.log('⚠️  Baseline issues detected:\n');
      
      issues.forEach((issue, index) => {
        const severity = getSeverityIcon(issue.severity);
        const line = issue.line;
        const column = issue.column;
        
        console.log(`${index + 1}. ${severity} ${issue.feature}`);
        console.log(`   📍 ${filePath}:${line}:${column}`);
        console.log(`   💬 ${issue.message}`);
        if (issue.suggestion) {
          console.log(`   💡 Suggestion: ${issue.suggestion}`);
        }
        console.log('');
      });

      // Simulate VS Code diagnostics
      console.log('🔧 VS Code Integration:');
      console.log('======================');
      console.log('• Inline warnings would appear in the editor');
      console.log('• Hover tooltips would show Baseline information');
      console.log('• Code actions would offer auto-fixes');
      console.log('• Problems panel would list all issues');
      console.log('• Tree view would show Baseline features\n');

      // Simulate auto-fix suggestions
      console.log('🤖 AI-Powered Auto-Fix Suggestions:');
      console.log('===================================');
      issues.forEach((issue, index) => {
        if (issue.suggestion) {
          console.log(`${index + 1}. ${issue.feature}:`);
          console.log(`   Current: ${getCurrentCode(content, issue.line)}`);
          console.log(`   Suggested: ${getSuggestedCode(issue)}`);
          console.log('');
        }
      });

    } else {
      console.log('✅ No Baseline issues found! All features are compliant.\n');
    }

    // Simulate hover information
    console.log('🖱️  Hover Information Demo:');
    console.log('==========================');
    console.log('When hovering over CSS properties, you would see:');
    console.log('• Baseline status (Widely/Newly/Limited)');
    console.log('• Browser support information');
    console.log('• Recommendations and alternatives');
    console.log('• Learning snippets and tutorials\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
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

function getCurrentCode(content, line) {
  const lines = content.split('\n');
  return lines[line - 1]?.trim() || '';
}

function getSuggestedCode(issue) {
  switch (issue.feature) {
    case 'word-break: auto-phrase':
      return 'word-break: break-word; /* More compatible alternative */';
    case 'CSS Subgrid':
      return '/* Use regular grid with explicit column definitions */';
    case ':has() selector':
      return '/* Use JavaScript querySelector as fallback */';
    case 'Container Queries':
      return '/* Use media queries as fallback */';
    default:
      return '/* Consider adding fallback */';
  }
}

// Run the demo
simulateVSCodeExtension();
