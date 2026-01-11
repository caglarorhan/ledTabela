# Package LED Tabela Extension for Chrome Web Store Submission
# This script creates a clean ZIP file ready for submission

$ErrorActionPreference = "Stop"

Write-Host "LED Tabela - Chrome Web Store Package Creator" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$sourceDir = Get-Location
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$parentDir = Split-Path -Parent $sourceDir
$outputZip = Join-Path $parentDir "ledTabela_v1.0.0_$timestamp.zip"

Write-Host "Source Directory: $sourceDir" -ForegroundColor Yellow
Write-Host "Output ZIP: $outputZip" -ForegroundColor Yellow
Write-Host ""

# Files and folders to INCLUDE
$includeFiles = @(
    "manifest.json",
    "popup.html",
    "popup.js",
    "led-tabela.js",
    "alphabet.js",
    "colorCharts.js",
    "itrs.js",
    "led-tabela_16.png",
    "led-tabela_24.png",
    "led-tabela_32.png",
    "led-tabela_64.png",
    "led-tabela_128.png"
)

# Check if all required files exist
Write-Host "Checking required files..." -ForegroundColor Green
$missingFiles = @()
foreach ($file in $includeFiles) {
    $filePath = Join-Path $sourceDir $file
    if (Test-Path $filePath) {
        Write-Host "  OK: $file" -ForegroundColor DarkGray
    }
    else {
        Write-Host "  MISSING: $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Error: Missing required files!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All required files found!" -ForegroundColor Green
Write-Host ""

# Create temporary directory for packaging
$tempDir = Join-Path $env:TEMP "ledTabela_package_$timestamp"
Write-Host "Creating temporary package directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy files to temp directory
Write-Host "Copying files..." -ForegroundColor Yellow
foreach ($file in $includeFiles) {
    $sourcePath = Join-Path $sourceDir $file
    $destPath = Join-Path $tempDir $file
    Copy-Item -Path $sourcePath -Destination $destPath -Force
    Write-Host "  Copied: $file" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Creating ZIP package..." -ForegroundColor Yellow

# Remove old zip if exists
if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
}

# Create ZIP
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -CompressionLevel Optimal

# Get ZIP size
$zipSize = (Get-Item $outputZip).Length
$zipSizeKB = [math]::Round($zipSize / 1KB, 2)
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)

# Clean up temp directory
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "Package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Package Details:" -ForegroundColor Cyan
Write-Host "  Location: $outputZip" -ForegroundColor White
Write-Host "  Size: $zipSizeKB KB" -ForegroundColor White
Write-Host "  Files: $($includeFiles.Count)" -ForegroundColor White
Write-Host ""

# Validation
Write-Host "Validation:" -ForegroundColor Cyan
if ($zipSizeMB -lt 100) {
    Write-Host "  Size OK (less than 100 MB limit)" -ForegroundColor Green
}
else {
    Write-Host "  Size WARNING (exceeds 100 MB)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review SUBMISSION_CHECKLIST.md" -ForegroundColor White
Write-Host "  2. Create store assets (screenshots, promotional images)" -ForegroundColor White
Write-Host "  3. Go to: https://chrome.google.com/webstore/devconsole" -ForegroundColor White
Write-Host "  4. Upload the ZIP file" -ForegroundColor White
Write-Host "  5. Fill in store listing details" -ForegroundColor White
Write-Host "  6. Submit for review" -ForegroundColor White
Write-Host ""
Write-Host "Ready for Chrome Web Store submission!" -ForegroundColor Green
Write-Host ""

# Open folder containing ZIP
Start-Process explorer.exe -ArgumentList "/select,`"$outputZip`""
