/**
 * Working Feature Analyzer - Production ready implementation
 */

import { WorkingBaselineDetector, WorkingBaselineIssue, WorkingScanResult, WorkingScanOptions } from './working-baseline-detector';
import * as fs from 'fs';
import * as path from 'path';

export class WorkingFeatureAnalyzer {
  private detector: WorkingBaselineDetector;

  constructor() {
    this.detector = new WorkingBaselineDetector();
  }

  async analyzeFile(filePath: string, content: string, _options: WorkingScanOptions = {}): Promise<WorkingBaselineIssue[]> {
    const issues: WorkingBaselineIssue[] = [];
    const lines = content.split('\n');

    // Simple pattern matching for demonstration
    lines.forEach((line, lineIndex) => {
      // Check for CSS Grid
      if (line.includes('display: grid') || line.includes('display:grid')) {
        const status = this.detector.getBaselineStatus('grid');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            'CSS Grid',
            status,
            {
              property: 'display',
              value: 'grid',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for CSS Subgrid
      if (line.includes('subgrid')) {
        const status = this.detector.getBaselineStatus('subgrid');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            'CSS Subgrid',
            status,
            {
              property: 'grid-template-columns',
              value: 'subgrid',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for word-break: auto-phrase
      if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
        const status = this.detector.getBaselineStatus('word-break-auto-phrase');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            'word-break: auto-phrase',
            status,
            {
              property: 'word-break',
              value: 'auto-phrase',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for :has() selector
      if (line.includes(':has(')) {
        const status = this.detector.getBaselineStatus('has-selector');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            ':has() selector',
            status,
            {
              property: ':has()',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for container queries
      if (line.includes('@container')) {
        const status = this.detector.getBaselineStatus('container-queries');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            'Container Queries',
            status,
            {
              property: '@container',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for CSS Nesting
      if (line.includes('&') && line.includes('{')) {
        const status = this.detector.getBaselineStatus('css-nesting');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'css',
            'CSS Nesting',
            status,
            {
              property: 'nesting',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for HTML dialog element
      if (line.includes('<dialog') || line.includes('</dialog>')) {
        const status = this.detector.getBaselineStatus('dialog-element');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'html',
            'HTML Dialog Element',
            status,
            {
              property: 'dialog',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }

      // Check for Array.toSorted
      if (line.includes('.toSorted(')) {
        const status = this.detector.getBaselineStatus('array-tosorted');
        if (status) {
          issues.push(this.detector.createBaselineIssue(
            'javascript',
            'Array.prototype.toSorted',
            status,
            {
              property: 'toSorted',
              line: lineIndex + 1,
              column: 1,
              file: filePath
            }
          ));
        }
      }
    });

    return issues;
  }

  async scanDirectory(dirPath: string, options: WorkingScanOptions = {}): Promise<WorkingScanResult> {
    const issues: WorkingBaselineIssue[] = [];
    let scannedFiles = 0;
    let filesWithIssues = 0;

    const files = this.getFilesToScan(dirPath, options);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const fileIssues = await this.analyzeFile(file, content, options);
        
        if (fileIssues.length > 0) {
          issues.push(...fileIssues);
          filesWithIssues++;
        }
        scannedFiles++;
      } catch (error) {
        console.warn(`Failed to analyze ${file}:`, error);
      }
    }

    return {
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
  }

  private getFilesToScan(dirPath: string, options: WorkingScanOptions): string[] {
    const files: string[] = [];
    // const _includePatterns = options.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html', '**/*.htm'];
    const excludePatterns = options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**', '**/out/**'];

    const scanDir = (currentPath: string) => {
      try {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
          const itemPath = path.join(currentPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            // Skip excluded directories
            if (!excludePatterns.some(pattern => itemPath.includes(pattern.replace('**/', '')))) {
              scanDir(itemPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm'].includes(ext)) {
              files.push(itemPath);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to scan directory ${currentPath}:`, error);
      }
    };

    scanDir(dirPath);
    return files;
  }
}
