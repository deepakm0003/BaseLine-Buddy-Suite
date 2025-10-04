/**
 * GitLab CI integration for Baseline checking
 */

import { BaselineChecker, CIConfig } from './baseline-checker';
import { PRCommenter } from './pr-commenter';

export class GitLabCIIntegration {
  private checker: BaselineChecker;
  private commenter: PRCommenter;

  constructor() {
    this.checker = new BaselineChecker();
    this.commenter = new PRCommenter();
  }

  /**
   * Run Baseline check in GitLab CI
   */
  async runCheck(): Promise<void> {
    try {
      // Get configuration from environment variables
      const config: CIConfig = {
        includePatterns: this.getEnvArray('BASELINE_INCLUDE_PATTERNS'),
        excludePatterns: this.getEnvArray('BASELINE_EXCLUDE_PATTERNS'),
        baselineLevel: (process.env.BASELINE_LEVEL as 'limited' | 'newly' | 'widely') || 'limited',
        failOnError: process.env.BASELINE_FAIL_ON_ERROR === 'true',
        failOnWarning: process.env.BASELINE_FAIL_ON_WARNING === 'true',
        outputFormat: (process.env.BASELINE_OUTPUT_FORMAT as 'json' | 'text' | 'github') || 'text',
        enableAI: process.env.BASELINE_ENABLE_AI === 'true'
      };

      // Get workspace path
      const workspacePath = process.env.CI_PROJECT_DIR || process.cwd();
      
      // Run Baseline check
      const result = await this.checker.checkDirectory(workspacePath, config);
      
      // Output results
      this.outputResults(result, config);
      
      // Comment on MR if enabled
      if (process.env.BASELINE_COMMENT_ON_MR === 'true' && process.env.CI_MERGE_REQUEST_IID) {
        await this.commentOnMR(result, config);
      }
      
      // Generate reports if requested
      if (process.env.BASELINE_JSON_REPORT) {
        this.checker.generateJSONReport(result.result, process.env.BASELINE_JSON_REPORT);
      }
      
      if (process.env.BASELINE_HTML_REPORT) {
        this.checker.generateHTMLReport(result.result, process.env.BASELINE_HTML_REPORT);
      }
      
      // Fail if check failed
      if (!result.success) {
        console.error('Baseline check failed');
        process.exit(1);
      }
      
    } catch (error) {
      console.error(`Baseline check failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Comment on MR with Baseline issues
   */
  private async commentOnMR(result: { success: boolean; result: any; summary: string }, config: CIConfig): Promise<void> {
    try {
      const token = process.env.GITLAB_TOKEN;
      if (!token) {
        console.warn('GitLab token not provided, skipping MR comment');
        return;
      }

      const projectId = process.env.CI_PROJECT_ID;
      const mergeRequestIid = process.env.CI_MERGE_REQUEST_IID;
      
      if (!projectId || !mergeRequestIid) {
        console.warn('Project ID or MR IID not available, skipping MR comment');
        return;
      }

      const comment = this.commenter.generatePRComment(result.result, config);
      
      // Use GitLab API to comment on MR
      const response = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: comment
        })
      });

      if (response.ok) {
        console.log('Commented on MR with Baseline issues');
      } else {
        console.warn(`Failed to comment on MR: ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`Failed to comment on MR: ${error.message}`);
    }
  }

  /**
   * Output results to GitLab CI
   */
  private outputResults(result: { success: boolean; result: any; summary: string }, config: CIConfig): void {
    // Output summary
    console.log(result.summary);
    
    // Output individual issues
    for (const issue of result.result.issues) {
      const level = issue.severity === 'error' ? 'error' : 
                   issue.severity === 'warning' ? 'warning' : 'info';
      
      console[level](`${issue.file}:${issue.line}:${issue.column} - ${issue.message}`);
    }
    
    // Set GitLab CI variables
    if (process.env.GITLAB_CI) {
      console.log(`export BASELINE_TOTAL_ISSUES=${result.result.summary.total}`);
      console.log(`export BASELINE_ERRORS=${result.result.summary.errors}`);
      console.log(`export BASELINE_WARNINGS=${result.result.summary.warnings}`);
      console.log(`export BASELINE_INFO=${result.result.summary.info}`);
      console.log(`export BASELINE_SUCCESS=${result.success}`);
    }
  }

  /**
   * Get environment variable array
   */
  private getEnvArray(envName: string): string[] {
    const value = process.env[envName];
    if (!value) {
      return [];
    }
    
    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
}

// Export for use in GitLab CI
export { GitLabCIIntegration };
