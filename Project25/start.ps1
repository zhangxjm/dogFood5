$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Art Lesson System - Startup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

$PythonPath = "C:\Users\ZXJ\AppData\Local\Programs\Python\Python310\python.exe"

if (-not (Test-Path $PythonPath)) {
    Write-Host "[ERROR] Python not found: $PythonPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$BackendPort = Get-Random -Minimum 10000 -Maximum 65000
$FrontendPort = Get-Random -Minimum 10000 -Maximum 65000

Write-Host "[INFO] Ports:" -ForegroundColor Yellow
Write-Host "        Backend: $BackendPort" -ForegroundColor Gray
Write-Host "        Frontend: $FrontendPort" -ForegroundColor Gray
Write-Host ""

$BackendDir = Join-Path $ProjectRoot "backend"
Set-Location $BackendDir

$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "[1/3] Creating virtual environment..." -ForegroundColor Yellow
    & $PythonPath -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to create virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
    $PipPath = Join-Path $BackendDir "venv\Scripts\pip.exe"
    & $PipPath install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "[1/3] Virtual environment exists" -ForegroundColor Green
    Write-Host "[2/3] Dependencies installed" -ForegroundColor Green
}

Write-Host "[3/3] Initializing database..." -ForegroundColor Yellow
$env:DB_TYPE = "sqlite"
$initCmd = "from init_data import init_data; from app import app; init_data(app)"
& $VenvPython -c $initCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Database initialization failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Starting services..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$env:BACKEND_PORT = $BackendPort
$BackendProcess = Start-Process -FilePath $VenvPython -ArgumentList "app.py" -PassThru -NoNewWindow

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$FrontendDir = Join-Path $ProjectRoot "frontend"
Set-Location $FrontendDir

$ServerScript = Join-Path $FrontendDir "server.py"
$FrontendProcess = Start-Process -FilePath $PythonPath -ArgumentList $ServerScript, $FrontendPort, $BackendPort -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  System Started!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:$FrontendPort" -ForegroundColor White
Write-Host "  Backend:  http://localhost:$BackendPort" -ForegroundColor White
Write-Host ""
Write-Host "  Sample data created:" -ForegroundColor Yellow
Write-Host "    - 12 students" -ForegroundColor Gray
Write-Host "    - 6 courses" -ForegroundColor Gray
Write-Host "    - 12 schedules" -ForegroundColor Gray
Write-Host "    - Multiple class records" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Ctrl+C to stop services" -ForegroundColor Yellow
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    
    if ($BackendProcess) {
        Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($FrontendProcess) {
        Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "Services stopped" -ForegroundColor Green
}
