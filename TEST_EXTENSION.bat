@echo off
echo Testing Baseline Buddy VS Code Extension...
echo.

REM Check if extension is installed
echo Checking if Baseline Buddy is installed...
code --list-extensions | findstr "baseline-buddy" >nul

if %errorlevel% equ 0 (
    echo ✅ SUCCESS: Baseline Buddy extension is installed!
    echo.
    echo To test the extension:
    echo 1. Open VS Code
    echo 2. Create a new CSS file (test.css)
    echo 3. Type: display: grid;
    echo 4. Hover over the text - you should see a tooltip
    echo 5. Look for color indicators (green/yellow/red)
    echo.
    echo Demo CSS to test:
    echo .container {
    echo   display: grid;        ^(should show green^)
    echo   gap: 20px;            ^(should show green^)
    echo }
    echo .card {
    echo   container-type: inline-size;  ^(should show yellow^)
    echo }
    echo .item {
    echo   word-break: auto-phrase;      ^(should show red^)
    echo }
    echo.
) else (
    echo ❌ ERROR: Baseline Buddy extension is not installed
    echo Please run INSTALL_EXTENSION.bat first
    echo.
)

pause
