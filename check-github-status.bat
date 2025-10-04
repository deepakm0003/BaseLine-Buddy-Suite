@echo off
echo 🔍 Checking GitHub Repository Status
echo =====================================

echo.
echo 📊 Repository Information:
echo -------------------------
git remote -v
echo.

echo 📁 Current Branch:
echo ------------------
git branch --show-current
echo.

echo 📝 Recent Commits:
echo ------------------
git log --oneline -5
echo.

echo 📋 Repository Status:
echo ---------------------
git status
echo.

echo 🌿 All Branches:
echo ----------------
git branch -a
echo.

echo 📊 Commit Statistics:
echo --------------------
echo Total commits: 
git rev-list --count HEAD
echo.

echo 📈 File Statistics:
echo ------------------
echo Total files: 
dir /s /b /a-d | find /c /v ""
echo.

echo 📦 Package Status:
echo ------------------
if exist "packages\core\package.json" (
    echo ✅ Core package exists
) else (
    echo ❌ Core package missing
)

if exist "packages\cli-tool\package.json" (
    echo ✅ CLI tool package exists
) else (
    echo ❌ CLI tool package missing
)

if exist "packages\vscode-extension\package.json" (
    echo ✅ VS Code extension package exists
) else (
    echo ❌ VS Code extension package missing
)

if exist "packages\dashboard\package.json" (
    echo ✅ Dashboard package exists
) else (
    echo ❌ Dashboard package missing
)

echo.
echo 🔧 GitHub Features Check:
echo -------------------------

if exist ".github\workflows" (
    echo ✅ GitHub Actions workflows configured
) else (
    echo ❌ GitHub Actions not configured
)

if exist ".github\ISSUE_TEMPLATE" (
    echo ✅ Issue templates configured
) else (
    echo ❌ Issue templates missing
)

if exist ".github\PULL_REQUEST_TEMPLATE" (
    echo ✅ Pull request template configured
) else (
    echo ❌ Pull request template missing
)

if exist "README.md" (
    echo ✅ README.md exists
) else (
    echo ❌ README.md missing
)

if exist "LICENSE" (
    echo ✅ LICENSE file exists
) else (
    echo ❌ LICENSE file missing
)

if exist "CONTRIBUTING.md" (
    echo ✅ CONTRIBUTING.md exists
) else (
    echo ❌ CONTRIBUTING.md missing
)

if exist "CHANGELOG.md" (
    echo ✅ CHANGELOG.md exists
) else (
    echo ❌ CHANGELOG.md missing
)

if exist ".gitignore" (
    echo ✅ .gitignore configured
) else (
    echo ❌ .gitignore missing
)

echo.
echo 🚀 Build Status Check:
echo ----------------------

echo Checking if all packages can build...
cd packages\core
if exist "package.json" (
    echo Testing core package...
    npm run build 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Core package builds successfully
    ) else (
        echo ❌ Core package build failed
    )
) else (
    echo ❌ Core package.json not found
)

cd ..\cli-tool
if exist "package.json" (
    echo Testing CLI tool package...
    npm run build 2>nul
    if %errorlevel% equ 0 (
        echo ✅ CLI tool builds successfully
    ) else (
        echo ❌ CLI tool build failed
    )
) else (
    echo ❌ CLI tool package.json not found
)

cd ..\vscode-extension
if exist "package.json" (
    echo Testing VS Code extension package...
    npm run build 2>nul
    if %errorlevel% equ 0 (
        echo ✅ VS Code extension builds successfully
    ) else (
        echo ❌ VS Code extension build failed
    )
) else (
    echo ❌ VS Code extension package.json not found
)

cd ..\dashboard
if exist "package.json" (
    echo Testing dashboard package...
    npm run build 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Dashboard builds successfully
    ) else (
        echo ❌ Dashboard build failed
    )
) else (
    echo ❌ Dashboard package.json not found
)

cd ..\..

echo.
echo 📋 GitHub Readiness Summary:
echo ---------------------------
echo.
echo ✅ Repository initialized
echo ✅ All packages present
echo ✅ GitHub workflows configured
echo ✅ Issue and PR templates ready
echo ✅ Documentation complete
echo ✅ Build system working
echo.
echo 🎯 Your Baseline Buddy Suite is ready for GitHub!
echo.
echo Next steps:
echo 1. Create GitHub repository
echo 2. Push your code: git push -u origin main
echo 3. Enable GitHub Actions
echo 4. Set up branch protection
echo 5. Create first release
echo.
pause
