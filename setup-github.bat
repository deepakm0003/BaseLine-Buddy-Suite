@echo off
echo 🐙 Setting up GitHub for Baseline Buddy Suite
echo ================================================

echo.
echo 📁 Initializing Git repository...
git init

echo.
echo 🔗 Adding remote origin (replace with your GitHub URL)...
echo git remote add origin https://github.com/yourusername/baseline-buddy-suite.git

echo.
echo 📝 Creating .gitignore file...
(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo
echo # Build outputs
echo dist/
echo build/
echo *.vsix
echo
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo
echo # IDE files
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo
echo # OS files
echo .DS_Store
echo Thumbs.db
echo
echo # Logs
echo logs/
echo *.log
echo
echo # Coverage
echo coverage/
echo .nyc_output/
echo
echo # Temporary files
echo tmp/
echo temp/
) > .gitignore

echo.
echo 📋 Creating GitHub Actions workflow...
mkdir .github\workflows

(
echo name: Test and Build
echo on:
echo   push:
echo     branches: [ main, develop ]
echo   pull_request:
echo     branches: [ main ]
echo
echo jobs:
echo   test:
echo     runs-on: ubuntu-latest
echo     strategy:
echo       matrix:
echo         package: [core, cli-tool, vscode-extension, dashboard]
echo     steps:
echo       - uses: actions/checkout@v3
echo       - name: Setup Node.js
echo         uses: actions/setup-node@v3
echo         with:
echo           node-version: '18'
echo           cache: 'npm'
echo       - name: Install dependencies
echo         run: npm install
echo       - name: Build ${{ matrix.package }}
echo         run: cd packages/${{ matrix.package }} ^&^& npm run build
echo       - name: Test ${{ matrix.package }}
echo         run: cd packages/${{ matrix.package }} ^&^& npm test
echo
echo   baseline-check:
echo     runs-on: ubuntu-latest
echo     steps:
echo       - uses: actions/checkout@v3
echo       - name: Setup Node.js
echo         uses: actions/setup-node@v3
echo         with:
echo           node-version: '18'
echo       - name: Install dependencies
echo         run: npm install
echo       - name: Build CLI tool
echo         run: cd packages/cli-tool ^&^& npm run build
echo       - name: Run Baseline check
echo         run: cd packages/cli-tool ^&^& npm run baseline-check
) > .github\workflows\test.yml

echo.
echo 📝 Creating issue templates...
mkdir .github\ISSUE_TEMPLATE

(
echo ---
echo name: Bug Report
echo about: Create a report to help us improve
echo title: '[BUG] '
echo labels: bug
echo assignees: ''
echo ---
echo
echo **Describe the bug**
echo A clear and concise description of what the bug is.
echo
echo **To Reproduce**
echo Steps to reproduce the behavior:
echo 1. Go to '...'
echo 2. Click on '....'
echo 3. Scroll down to '....'
echo 4. See error
echo
echo **Expected behavior**
echo A clear and concise description of what you expected to happen.
echo
echo **Screenshots**
echo If applicable, add screenshots to help explain your problem.
echo
echo **Environment:**
echo - OS: [e.g. Windows 10, macOS, Linux]
echo - Node.js version: [e.g. 18.0.0]
echo - Package version: [e.g. 1.0.0]
echo
echo **Additional context**
echo Add any other context about the problem here.
) > .github\ISSUE_TEMPLATE\bug_report.md

(
echo ---
echo name: Feature Request
echo about: Suggest an idea for this project
echo title: '[FEATURE] '
echo labels: enhancement
echo assignees: ''
echo ---
echo
echo **Is your feature request related to a problem? Please describe.**
echo A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]
echo
echo **Describe the solution you'd like**
echo A clear and concise description of what you want to happen.
echo
echo **Describe alternatives you've considered**
echo A clear and concise description of any alternative solutions or features you've considered.
echo
echo **Additional context**
echo Add any other context or screenshots about the feature request here.
) > .github\ISSUE_TEMPLATE\feature_request.md

echo.
echo 📋 Creating pull request template...
mkdir .github\PULL_REQUEST_TEMPLATE

(
echo ## Description
echo Brief description of the changes made.
echo
echo ## Type of Change
echo - [ ] Bug fix (non-breaking change which fixes an issue)
echo - [ ] New feature (non-breaking change which adds functionality)
echo - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
echo - [ ] Documentation update
echo
echo ## Testing
echo - [ ] Tests pass locally
echo - [ ] New tests added for new functionality
echo - [ ] Baseline compliance check passed
echo
echo ## Checklist
echo - [ ] Code follows project style guidelines
echo - [ ] Self-review completed
echo - [ ] Documentation updated
echo - [ ] No console errors
echo
echo ## Screenshots (if applicable)
echo Add screenshots to help explain your changes.
) > .github\PULL_REQUEST_TEMPLATE\pull_request_template.md

echo.
echo 📄 Creating CONTRIBUTING.md...
(
echo # Contributing to Baseline Buddy Suite
echo
echo Thank you for your interest in contributing to Baseline Buddy Suite! This document provides guidelines for contributing to the project.
echo
echo ## Getting Started
echo
echo 1. Fork the repository
echo 2. Clone your fork: `git clone https://github.com/yourusername/baseline-buddy-suite.git`
echo 3. Create a feature branch: `git checkout -b feature/amazing-feature`
echo 4. Install dependencies: `npm install`
echo
echo ## Development Setup
echo
echo ### Prerequisites
echo - Node.js 18+
echo - npm or yarn
echo - Git
echo
echo ### Installation
echo ```bash
echo npm install
echo ```
echo
echo ### Running Tests
echo ```bash
echo npm test
echo ```
echo
echo ### Building
echo ```bash
echo npm run build
echo ```
echo
echo ## Contributing Guidelines
echo
echo ### Code Style
echo - Use TypeScript for all new code
echo - Follow existing code patterns
echo - Add tests for new functionality
echo - Update documentation as needed
echo
echo ### Commit Messages
echo Use conventional commits:
echo - `feat:` for new features
echo - `fix:` for bug fixes
echo - `docs:` for documentation
echo - `test:` for tests
echo - `chore:` for maintenance
echo
echo ### Pull Request Process
echo 1. Create a feature branch
echo 2. Make your changes
echo 3. Add tests if applicable
echo 4. Run tests and ensure they pass
echo 5. Update documentation
echo 6. Submit a pull request
echo
echo ## Baseline Compliance
echo
echo All code must pass Baseline compliance checks:
echo - Use only Baseline-safe features
echo - Provide fallbacks for newer features
echo - Document browser support requirements
echo
echo ## Questions?
echo
echo If you have questions, please open an issue or start a discussion.
) > CONTRIBUTING.md

echo.
echo 📄 Creating CHANGELOG.md...
(
echo # Changelog
echo
echo All notable changes to Baseline Buddy Suite will be documented in this file.
echo
echo The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
echo and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
echo
echo ## [Unreleased]
echo
echo ### Added
echo - Baseline Time Machine interactive timeline
echo - VS Code extension with real-time Baseline checking
echo - CLI tool for CI/CD integration
echo - Web dashboard with file upload and PDF export
echo - Comprehensive Baseline compliance checking
echo
echo ### Changed
echo - Enhanced file analysis with JavaScript and CSS-in-JS support
echo - Improved CLI demo with real file analysis
echo - Updated dashboard with animated background
echo
echo ### Fixed
echo - Resolved file analysis inconsistencies
echo - Fixed PDF generation formatting issues
echo - Improved VS Code extension packaging
echo
echo ## [1.0.0] - 2025-01-XX
echo
echo ### Added
echo - Initial release of Baseline Buddy Suite
echo - Core Baseline detection and analysis
echo - VS Code extension for real-time checking
echo - CLI tool for automated scanning
echo - Web dashboard for interactive analysis
echo - Baseline Time Machine for historical exploration
) > CHANGELOG.md

echo.
echo 🔧 Creating package.json scripts for GitHub Actions...
(
echo {
echo   "name": "baseline-buddy-suite",
echo   "version": "1.0.0",
echo   "description": "AI-powered ecosystem for modern web features with Baseline compliance checking",
echo   "private": true,
echo   "workspaces": [
echo     "packages/*"
echo   ],
echo   "scripts": {
echo     "build": "npm run build --workspaces",
echo     "test": "npm run test --workspaces",
echo     "lint": "npm run lint --workspaces",
echo     "baseline-check": "cd packages/cli-tool && npm run baseline-check",
echo     "prepare": "husky install"
echo   },
echo   "devDependencies": {
echo     "husky": "^8.0.3",
echo     "lint-staged": "^13.2.0"
echo   },
echo   "lint-staged": {
echo     "*.{js,ts,tsx}": [
echo       "eslint --fix",
echo       "prettier --write"
echo     ]
echo   }
echo }
) > package.json

echo.
echo 🎯 GitHub setup complete!
echo.
echo Next steps:
echo 1. Create a GitHub repository
echo 2. Update the remote URL: git remote set-url origin YOUR_GITHUB_URL
echo 3. Add all files: git add .
echo 4. Commit: git commit -m "Initial commit: Baseline Buddy Suite"
echo 5. Push: git push -u origin main
echo.
echo Your Baseline Buddy Suite is now ready for GitHub! 🚀
pause
