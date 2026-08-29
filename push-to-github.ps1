# ============================================================================
#  Publishes this folder to:
#  https://github.com/PrasannaKumarThirunagari/SilkTestCaseGenerator.git
#
#  Run from this folder in PowerShell:
#      .\push-to-github.ps1
#
#  If PowerShell blocks the script, run it once as:
#      powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1
# ============================================================================

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

$Remote = 'https://github.com/PrasannaKumarThirunagari/SilkTestCaseGenerator.git'
$Branch = 'main'

Write-Host "Working in: $PSScriptRoot" -ForegroundColor Cyan

# --- 1. Clear the incomplete .git left by the sandbox ------------------------
# The assistant's sandbox could create files but not delete them, so it may
# have left a half-initialised .git with a stale index.lock. It has no commits,
# so removing it loses nothing.
if (Test-Path '.git') {
    $hasCommits = $false
    try { git rev-parse --verify HEAD 2>$null | Out-Null; $hasCommits = $? } catch { $hasCommits = $false }

    if ($hasCommits) {
        Write-Host "Existing repository with commits found - keeping it." -ForegroundColor Yellow
    } else {
        Write-Host "Removing incomplete .git (no commits present)..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force '.git'
    }
}

# --- 2. Initialise ----------------------------------------------------------
if (-not (Test-Path '.git')) {
    git init -b $Branch
}

# --- 3. Point at the remote -------------------------------------------------
$existing = (git remote 2>$null)
if ($existing -contains 'origin') {
    git remote set-url origin $Remote
} else {
    git remote add origin $Remote
}

# --- 4. Stage and commit ----------------------------------------------------
git add -A

$message = @"
Add Silk Test Case Prompt Builder

Client-side prompt generator for Silk Test cases. Collects test context,
navigation steps, SilkCentral steps and verification evidence, then builds
an AI prompt containing only the entered information.

- index.html    UI structure
- style.css     all styling
- script.js     comboboxes, dynamic rows, prompt generation, copy/download
- dataloads.js  single source of truth for option lists and samples

No frameworks, no CDN, no build step, no backend.
"@

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "Nothing new to commit." -ForegroundColor Yellow
} else {
    git commit -m $message
}

# --- 5. Push ----------------------------------------------------------------
Write-Host "Pushing to $Remote ..." -ForegroundColor Cyan
git push -u origin $Branch

Write-Host ""
Write-Host "Done. View it at:" -ForegroundColor Green
Write-Host "https://github.com/PrasannaKumarThirunagari/SilkTestCaseGenerator" -ForegroundColor Green
