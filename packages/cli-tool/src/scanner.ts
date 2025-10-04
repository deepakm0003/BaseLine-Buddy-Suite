/**
 * Scanner for Baseline compliance checking
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { WorkingFeatureAnalyzer, WorkingScanOptions, WorkingScanResult } from '@baseline-buddy/core';

export class BaselineScanner {
  private analyzer: WorkingFeatureAnalyzer;

  constructor() {
    this.analyzer = new WorkingFeatureAnalyzer();
  }

  /**
   * Scan a directory for Baseline issues
   */
  async scanDirectory(dirPath: string, options: WorkingScanOptions = {}): Promise<WorkingScanResult> {
    // Validate path
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Path does not exist: ${dirPath}`);
    }

    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (!isDirectory) {
      throw new Error(`Path is not a directory: ${dirPath}`);
    }

    // Scan for issues
    return await this.analyzer.scanDirectory(dirPath, options);
  }

  /**
   * Scan a single file for Baseline issues
   */
  async scanFile(filePath: string, options: WorkingScanOptions = {}): Promise<WorkingScanResult> {
    // Validate path
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    const isFile = fs.statSync(filePath).isFile();
    if (!isFile) {
      throw new Error(`Path is not a file: ${filePath}`);
    }

    // Read file content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Analyze file
    const issues = await this.analyzer.analyzeFile(filePath, content, options);
    
    // Create scan result
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
        scanned: 1,
        withIssues: issues.length > 0 ? 1 : 0
      }
    };
  }

  /**
   * Get files to scan based on patterns
   */
  getFilesToScan(dirPath: string, options: WorkingScanOptions = {}): string[] {
    const files: string[] = [];
    const includePatterns = options.includePatterns || ['**/*.css', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.html'];
    const excludePatterns = options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**'];

    this.walkDirectory(dirPath, (filePath) => {
      const relativePath = path.relative(dirPath, filePath);
      
      // Check include patterns
      const shouldInclude = includePatterns.some((pattern: string) => 
        this.matchesPattern(relativePath, pattern)
      );
      
      // Check exclude patterns
      const shouldExclude = excludePatterns.some((pattern: string) => 
        this.matchesPattern(relativePath, pattern)
      );

      if (shouldInclude && !shouldExclude) {
        files.push(filePath);
      }
    });

    return files;
  }

  /**
   * Walk directory recursively
   */
  private walkDirectory(dirPath: string, callback: (filePath: string) => void): void {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.walkDirectory(itemPath, callback);
      } else if (stat.isFile()) {
        callback(itemPath);
      }
    }
  }

  /**
   * Check if path matches pattern
   */
  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple glob pattern matching
    const regex = new RegExp(
      pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\./g, '\\.')
    );
    return regex.test(filePath);
  }
}

