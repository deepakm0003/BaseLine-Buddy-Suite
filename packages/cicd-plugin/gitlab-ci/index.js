/**
 * GitLab CI entry point for Baseline Buddy
 */

const { GitLabCIIntegration } = require('../dist/gitlab-ci');

async function run() {
  const integration = new GitLabCIIntegration();
  await integration.runCheck();
}

run().catch(error => {
  console.error('Baseline Buddy GitLab CI failed:', error);
  process.exit(1);
});
