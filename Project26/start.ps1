[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  节日礼品清单管理系统 - 一键启动脚本" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ---------- 生成随机端口 ----------
$global:MONGO_PORT    = 27000 + (Get-Random -Maximum 2000)
$global:BACKEND_PORT  = 8000  + (Get-Random -Maximum 2000)
$global:FRONTEND_PORT = 5000  + (Get-Random -Maximum 2000)

Write-Host "[INFO] MongoDB 端口 : $MONGO_PORT" -ForegroundColor Gray
Write-Host "[INFO] 后端 API 端口: $BACKEND_PORT" -ForegroundColor Gray
Write-Host "[INFO] 前端访问端口 : $FRONTEND_PORT" -ForegroundColor Gray
Write-Host ""

# ---------- 检查 Docker ----------
Write-Host "[检查] 检测 Docker ..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] 未检测到 Docker，请先安装 Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host "  -> Docker 已就绪" -ForegroundColor Green

# ---------- 检查 Node.js ----------
Write-Host "[检查] 检测 Node.js ..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] 未检测到 Node.js，请先安装 Node.js 16+" -ForegroundColor Red
    exit 1
}
Write-Host "  -> Node.js $(node --version) 已就绪" -ForegroundColor Green

# ---------- 启动 MongoDB ----------
Write-Host "[1/5] 启动 MongoDB 容器..." -ForegroundColor Yellow
docker rm -f gift-list-mongo 2>$null | Out-Null
docker run -d --name gift-list-mongo -p "${MONGO_PORT}:27017" mongo:6 --wiredEngineCacheSizeGB 0.25
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] MongoDB 容器启动失败" -ForegroundColor Red
    exit 1
}

# ---------- 等待 MongoDB ----------
Write-Host "[2/5] 等待 MongoDB 就绪..." -ForegroundColor Yellow
$mongoReady = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        docker exec gift-list-mongo mongo --eval "db.adminCommand('ping')" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $mongoReady = $true; break }
    } catch {}
    Start-Sleep -Seconds 2
}
if (-not $mongoReady) {
    Write-Host "[WARN] MongoDB 可能未完全就绪，继续尝试..." -ForegroundColor DarkYellow
}
Start-Sleep -Seconds 3
Write-Host "  -> MongoDB 已就绪" -ForegroundColor Green

# ---------- 安装后端依赖 ----------
$backendDir  = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

Write-Host "[3/5] 安装后端依赖并初始化数据..." -ForegroundColor Yellow
Set-Location $backendDir
if (-not (Test-Path "node_modules")) {
    Write-Host "  -> 正在安装后端依赖，请稍候..." -ForegroundColor Gray
    npm install --no-audit --no-fund
}

$env:MONGO_HOST = "localhost"
$env:MONGO_PORT = "$MONGO_PORT"
$env:MONGO_DB   = "gift_list_db"
$env:PORT       = "$BACKEND_PORT"

try {
    node seed.js
} catch {
    Write-Host "[WARN] 初始化数据失败（可能已存在数据），继续..." -ForegroundColor DarkYellow
}

# ---------- 安装前端依赖 ----------
Write-Host "[4/5] 安装前端依赖并构建..." -ForegroundColor Yellow
Set-Location $frontendDir
if (-not (Test-Path "node_modules")) {
    Write-Host "  -> 正在安装前端依赖（首次较慢，请稍候）..." -ForegroundColor Gray
    npm install --no-audit --no-fund
}

$env:REACT_APP_API_BASE = "http://localhost:${BACKEND_PORT}/api"
$env:CI = "true"
$env:BROWSER = "none"

Write-Host "  -> 正在构建前端..." -ForegroundColor Gray
npx react-scripts build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] 前端构建失败" -ForegroundColor Red
    exit 1
}

# ---------- 启动后端（后台） ----------
Write-Host "[5/5] 启动后端服务..." -ForegroundColor Yellow
Set-Location $backendDir

$backendProc = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden `
    -Environment @{
        MONGO_HOST = "localhost"
        MONGO_PORT = "$MONGO_PORT"
        MONGO_DB   = "gift_list_db"
        PORT       = "$BACKEND_PORT"
    }

Start-Sleep -Seconds 2

# ---------- 启动前端（后台） ----------
Set-Location $frontendDir
$frontendProc = Start-Process -FilePath "node" -ArgumentList "serve.js" -PassThru -WindowStyle Hidden `
    -Environment @{
        PORT = "$FRONTEND_PORT"
    }

# 保存 PID 方便停止
Set-Location $PSScriptRoot
"$($backendProc.Id) $($frontendProc.Id)" | Out-File -FilePath ".pids" -Encoding ASCII

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  启动完成！" -ForegroundColor Green
Write-Host "  前端访问: http://localhost:$FRONTEND_PORT" -ForegroundColor White
Write-Host "  后端 API: http://localhost:$BACKEND_PORT/api" -ForegroundColor White
Write-Host "  MongoDB : localhost:$MONGO_PORT" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "停止服务请运行: .\stop.ps1" -ForegroundColor Gray
Write-Host ""
