# Led Tabela Extension Validator
# This script validates the extension structure and files

$ExtensionPath = "d:\htdocs\chrome-extensions\ledTabela\ledTabela"
$ErrorsFound = 0
$WarningsFound = 0

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "LED TABELA EXTENSION VALIDATOR" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if manifest.json exists
Write-Host "[TEST 1] Checking manifest.json..." -NoNewline
if (Test-Path "$ExtensionPath\manifest.json") {
    Write-Host " PASS" -ForegroundColor Green
    
    try {
        $manifest = Get-Content "$ExtensionPath\manifest.json" -Raw | ConvertFrom-Json
        Write-Host "  [OK] Valid JSON syntax" -ForegroundColor Green
        
        if ($manifest.manifest_version -eq 3) {
            Write-Host "  [OK] Manifest V3 detected" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] Not Manifest V3" -ForegroundColor Red
            $ErrorsFound++
        }
        
        if ($manifest.name -and $manifest.version -and $manifest.action) {
            Write-Host "  [OK] Required fields present" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] Some required fields missing" -ForegroundColor Yellow
            $WarningsFound++
        }
        
    } catch {
        Write-Host "  [ERROR] Invalid JSON syntax" -ForegroundColor Red
        $ErrorsFound++
    }
} else {
    Write-Host " FAIL" -ForegroundColor Red
    $ErrorsFound++
}

# Test 2: Check icon files
Write-Host ""
Write-Host "[TEST 2] Checking icon files..." -NoNewline
$iconSizes = @(16, 24, 32, 64, 128)
$allIconsPresent = $true
foreach ($size in $iconSizes) {
    $iconPath = "$ExtensionPath\led-tabela_$size.png"
    if (!(Test-Path $iconPath)) {
        Write-Host ""
        Write-Host "  [ERROR] Missing icon: led-tabela_$size.png" -ForegroundColor Red
        $ErrorsFound++
        $allIconsPresent = $false
    }
}
if ($allIconsPresent) {
    Write-Host " PASS" -ForegroundColor Green
    foreach ($size in $iconSizes) {
        Write-Host "  [OK] led-tabela_$size.png" -ForegroundColor Green
    }
}

# Test 3: Check popup files
Write-Host ""
Write-Host "[TEST 3] Checking popup files..." -NoNewline
$popupFiles = @("popup.html", "popup.js")
$allPopupPresent = $true
foreach ($file in $popupFiles) {
    if (!(Test-Path "$ExtensionPath\$file")) {
        Write-Host ""
        Write-Host "  [ERROR] Missing file: $file" -ForegroundColor Red
        $ErrorsFound++
        $allPopupPresent = $false
    }
}
if ($allPopupPresent) {
    Write-Host " PASS" -ForegroundColor Green
    foreach ($file in $popupFiles) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    }
}

# Test 4: Check content scripts
Write-Host ""
Write-Host "[TEST 4] Checking content scripts..." -NoNewline
$contentScripts = @("led-tabela.js", "alphabet.js", "colorCharts.js")
$allContentPresent = $true
foreach ($script in $contentScripts) {
    if (!(Test-Path "$ExtensionPath\$script")) {
        Write-Host ""
        Write-Host "  [ERROR] Missing script: $script" -ForegroundColor Red
        $ErrorsFound++
        $allContentPresent = $false
    }
}
if ($allContentPresent) {
    Write-Host " PASS" -ForegroundColor Green
    foreach ($script in $contentScripts) {
        Write-Host "  [OK] $script" -ForegroundColor Green
    }
}

# Test 5: Check web accessible resources
Write-Host ""
Write-Host "[TEST 5] Checking web accessible resources..." -NoNewline
$webResources = @("itrs.js")
$allResourcesPresent = $true
foreach ($resource in $webResources) {
    if (!(Test-Path "$ExtensionPath\$resource")) {
        Write-Host ""
        Write-Host "  [ERROR] Missing resource: $resource" -ForegroundColor Red
        $ErrorsFound++
        $allResourcesPresent = $false
    }
}
if ($allResourcesPresent) {
    Write-Host " PASS" -ForegroundColor Green
    foreach ($resource in $webResources) {
        Write-Host "  [OK] $resource" -ForegroundColor Green
    }
}

# Test 6: Check for common issues
Write-Host ""
Write-Host "[TEST 6] Scanning for common issues..."

$manifestContent = Get-Content "$ExtensionPath\manifest.json" -Raw
if ($manifestContent -match '"\./') {
    Write-Host "  [WARN] Found './' prefixes in manifest" -ForegroundColor Yellow
    $WarningsFound++
} else {
    Write-Host "  [OK] No './' prefixes in manifest" -ForegroundColor Green
}

$popupContent = Get-Content "$ExtensionPath\popup.js" -Raw
if ($popupContent -match "chrome\.runtime\.onMessage\.addListener") {
    Write-Host "  [OK] Message listeners present" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Message listeners may be missing" -ForegroundColor Yellow
    $WarningsFound++
}

# Test 7: File sizes check
Write-Host ""
Write-Host "[TEST 7] Checking file sizes..."
$largeFiles = Get-ChildItem -Path $ExtensionPath -File | Where-Object { $_.Length -gt 1MB }
if ($largeFiles.Count -eq 0) {
    Write-Host "  [OK] All files under 1MB" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Large files detected:" -ForegroundColor Yellow
    foreach ($file in $largeFiles) {
        $sizeMB = [math]::Round($file.Length / 1MB, 2)
        Write-Host "    - $($file.Name): $sizeMB MB" -ForegroundColor Yellow
    }
    $WarningsFound++
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$totalTests = 7

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Errors: $ErrorsFound" -ForegroundColor $(if($ErrorsFound -eq 0){"Green"}else{"Red"})
Write-Host "Warnings: $WarningsFound" -ForegroundColor $(if($WarningsFound -eq 0){"Green"}else{"Yellow"})

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

if ($ErrorsFound -eq 0 -and $WarningsFound -eq 0) {
    Write-Host "SUCCESS: ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your extension is ready to load in Chrome!" -ForegroundColor Green
    Write-Host "Next step: Load unpacked extension from chrome://extensions/" -ForegroundColor Cyan
    exit 0
} elseif ($ErrorsFound -eq 0) {
    Write-Host "PASSED WITH WARNINGS" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Extension should work, but review warnings above." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "VALIDATION FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix errors before loading extension." -ForegroundColor Red
    exit 1
}
