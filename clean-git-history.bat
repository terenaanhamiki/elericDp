@echo off
REM Git History Cleaning Script for Windows
REM This script removes sensitive files from git history

echo.
echo ====================================
echo    Git History Cleaning Script
echo ====================================
echo.
echo This script will remove get-stripe-prices.js from git history
echo WARNING: This will rewrite git history!
echo.

set /p confirm="Do you want to continue? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo Aborted
    exit /b 1
)

echo.
echo Checking prerequisites...
echo.

REM Check if git-filter-repo is available
where git-filter-repo >nul 2>nul
if %errorlevel% equ 0 (
    echo git-filter-repo found
    echo.
    echo Removing get-stripe-prices.js from history...
    git filter-repo --path get-stripe-prices.js --invert-paths --force
    
    if %errorlevel% equ 0 (
        echo.
        echo File removed from history successfully!
        echo.
        echo Next steps:
        echo 1. Add remote: git remote add origin https://github.com/terenaanhamiki/elericDp.git
        echo 2. Force push: git push origin main --force
        echo.
        echo WARNING: Make sure all team members know about this history rewrite!
    ) else (
        echo.
        echo Failed to remove file from history
        exit /b 1
    )
) else (
    echo git-filter-repo not found
    echo.
    echo Installation options:
    echo.
    echo Option 1 - Using pip:
    echo   pip install git-filter-repo
    echo.
    echo Option 2 - Using BFG Repo-Cleaner:
    echo   1. Download from: https://rtyley.github.io/bfg-repo-cleaner/
    echo   2. Run: java -jar bfg.jar --delete-files get-stripe-prices.js
    echo.
    echo Option 3 - Manual (not recommended):
    echo   git filter-branch --force --index-filter ^
    echo     "git rm --cached --ignore-unmatch get-stripe-prices.js" ^
    echo     --prune-empty --tag-name-filter cat -- --all
    echo.
    exit /b 1
)

pause
