$ErrorActionPreference = "SilentlyContinue"
Write-Host "正在停止服务..." -ForegroundColor Yellow

# 停止 Node 进程
if (Test-Path ".pids") {
    $pids = Get-Content ".pids"
    foreach ($pid in $pids -split " ") {
        if ($pid -match "^\d+$") {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Remove-Item ".pids" -Force
}

# 停止 MongoDB 容器
docker rm -f gift-list-mongo 2>$null | Out-Null

Write-Host "服务已停止" -ForegroundColor Green
