@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo        GitHub Push Helper for Developer Portfolio
echo ========================================================
echo.

set /p GITHUB_USER="Enter your GitHub username (Default: Dipjyoti-Code1): "
if "!GITHUB_USER!"=="" set GITHUB_USER=Dipjyoti-Code1

set /p REPO_NAME="Enter your GitHub repository name (e.g. my-portfolio): "
if "!REPO_NAME!"=="" (
    echo [ERROR] Repository name cannot be empty.
    pause
    exit /b 1
)

set /p GITHUB_TOKEN="Enter your GitHub Personal Access Token (PAT): "
if "!GITHUB_TOKEN!"=="" (
    echo [ERROR] GitHub token cannot be empty.
    pause
    exit /b 1
)

echo.
echo Configuring remote and pushing to branch 'main'...
echo.

git branch -M main
git remote remove origin 2>nul
git remote add origin https://!GITHUB_TOKEN!@github.com/!GITHUB_USER!/!REPO_NAME!.git

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  SUCCESS: Code pushed to https://github.com/!GITHUB_USER!/!REPO_NAME!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  [ERROR] Push failed. Please check:
    echo  1. Did you create the empty repository on GitHub first?
    echo  2. Does your token have the 'repo' scope permission?
    echo ========================================================
)

pause
