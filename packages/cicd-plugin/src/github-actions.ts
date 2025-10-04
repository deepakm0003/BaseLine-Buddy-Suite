/**
 * GitHub Actions integration for Baseline checking
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import { BaselineChecker, CIConfig } from './baseline-checker';
import { PRCommenter } from './pr-commenter';

export class GitHubActionsIntegration {
  private checker: BaselineChecker;
  private commenter: PRCommenter;

  constructor() {
    this.checker = new BaselineChecker();
    this.commenter = new PRCommenter();
  }

  /**
   * Run Baseline check in GitHub Actions
   */
  async runCheck(): Promise<void> {
    try {
      // Get configuration from inputs
      const config: CIConfig = {
        includePatterns: this.getInputArray('include-patterns'),
        excludePatterns: this.getInputArray('exclude-patterns'),
        baselineLevel: core.getInput('baseline-level') as 'limited' | 'newly' | 'widely' || 'limited',
        failOnError: core.getBooleanInput('fail-on-error'),
        failOnWarning: core.getBooleanInput('fail-on-warning'),
        outputFormat: core.getInput('output-format') as 'json' | 'text' | 'github' || 'github',
        enableAI: core.getBooleanInput('enable-ai')
      };

      // Get workspace path
      const workspacePath = core.getInput('workspace-path') || process.cwd();
      
      // Run Baseline check
      const result = await this.checker.checkDirectory(workspacePath, config);
      
      // Output results
      this.outputResults(result, config);
      
      // Comment on PR if enabled
      if (core.getBooleanInput('comment-on-pr') && github.context.payload.pull_request) {
        await this.commentOnPR(result, config);
      }
      
      // Generate reports if requested
      if (core.getInput('json-report')) {
        this.checker.generateJSONReport(result.result, core.getInput('json-report'));
      }
      
      if (core.getInput('html-report')) {
        this.checker.generateHTMLReport(result.result, core.getInput('html-report'));
      }
      
      // Set GitHub Actions outputs
      this.checker.generateGitHubOutput(result.result, config);
      
      // Fail if check failed
      if (!result.success) {
        core.setFailed(result.summary);
      }
      
    } catch (error) {
      core.setFailed(`Baseline check failed: ${error.message}`);
    }
  }

  /**
   * Comment on PR with Baseline issues
   */
  private async commentOnPR(result: { success: boolean; result: any; summary: string }, config: CIConfig): Promise<void> {
    try {
      const token = core.getInput('github-token');
      if (!token) {
        core.warning('GitHub token not provided, skipping PR comment');
        return;
      }

      const octokit = github.getOctokit(token);
      const { owner, repo, number } = github.context.issue;
      
      const comment = this.commenter.generatePRComment(result.result, config);
      
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: comment
      });
      
      core.info('Commented on PR with Baseline issues');
    } catch (error) {
      core.warning(`Failed to comment on PR: ${error.message}`);
    }
  }

  /**
   * Output results to GitHub Actions
   */
  private outputResults(result: { success: boolean; result: any; summary: string }, config: CIConfig): void {
    // Output summary
    core.info(result.summary);
    
    // Output individual issues
    for (const issue of result.result.issues) {
      const level = issue.severity === 'error' ? 'error' : 
                   issue.severity === 'warning' ? 'warning' : 'info';
      
      core[level](`${issue.file}:${issue.line}:${issue.column} - ${issue.message}`);
    }
    
    // Set outputs
    core.setOutput('total-issues', result.result.summary.total);
    core.setOutput('errors', result.result.summary.errors);
    core.setOutput('warnings', result.result.summary.warnings);
    core.setOutput('info', result.result.summary.info);
    core.setOutput('success', result.success);
  }

  /**
   * Get input array from GitHub Actions inputs
   */
  private getInputArray(inputName: string): string[] {
    const input = core.getInput(inputName);
    if (!input) {
      return [];
    }
    
    return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
}

// Export for use in GitHub Actions
export { GitHubActionsIntegration };
