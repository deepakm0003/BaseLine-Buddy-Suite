/**
 * GitHub Actions entry point for Baseline Buddy
 */

const { GitHubActionsIntegration } = require('../dist/github-actions');

async function run() {
  const integration = new GitHubActionsIntegration();
  await integration.runCheck();
}

run().catch(error => {
  console.error('Baseline Buddy GitHub Actions failed:', error);
  process.exit(1);
});
