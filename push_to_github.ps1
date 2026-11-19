# GitHub Push Helper Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       GitHub Push Helper for Developer Portfolio" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$defaultUser = "Dipjyoti-Code1"
$usernameInput = Read-Host "Enter GitHub Username (Press Enter for '$defaultUser')"
$username = if ([string]::IsNullOrWhiteSpace($usernameInput)) { $defaultUser } else { $usernameInput.Trim() }

$repoName = (Read-Host "Enter your GitHub Repository Name (e.g. portfolio)").Trim()
if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "[ERROR] Repository name cannot be empty." -ForegroundColor Red
    exit 1
}

$token = (Read-Host "Enter your GitHub Personal Access Token (PAT)").Trim()
if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "[ERROR] Token cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host "`nSetting up remote origin..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin "https://${token}@github.com/${username}/${repoName}.git"

Write-Host "Pushing to main branch..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " SUCCESS: Pushed to https://github.com/${username}/${repoName}" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "`n========================================================" -ForegroundColor Red
    Write-Host " [ERROR] Push failed. Make sure the repo exists on GitHub and token has 'repo' scope." -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Red
}
