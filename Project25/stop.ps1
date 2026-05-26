# 停止少儿绘画课时记录系统
$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  停止少儿绘画课时记录系统" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "正在停止服务..." -ForegroundColor Yellow
docker compose down

Write-Host ""
Write-Host "服务已停止" -ForegroundColor Green
Write-Host ""

Read-Host "按回车键退出"
