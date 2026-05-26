@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   节日礼品清单管理系统 - 一键启动脚本
echo ============================================
echo.

REM ---------- 生成随机端口 ----------
set /a MONGO_PORT=27000 + %random% %% 2000
set /a BACKEND_PORT=8000 + %random% %% 2000
set /a FRONTEND_PORT=5000 + %random% %% 2000

echo [INFO] MongoDB 端口: %MONGO_PORT%
echo [INFO] 后端 API 端口: %BACKEND_PORT%
echo [INFO] 前端访问端口: %FRONTEND_PORT%
echo.

REM ---------- 检查 Docker ----------
where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 未检测到 Docker，请先安装 Docker Desktop
    exit /b 1
)

REM ---------- 检查 Node.js ----------
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 未检测到 Node.js，请先安装 Node.js 16+
    exit /b 1
)

REM ---------- 启动 MongoDB ----------
echo [1/5] 启动 MongoDB 容器...
docker rm -f gift-list-mongo >nul 2>&1
docker run -d --name gift-list-mongo -p %MONGO_PORT%:27017 mongo:6 --wiredEngineCacheSizeGB 0.25
if errorlevel 1 (
    echo [ERROR] MongoDB 容器启动失败
    exit /b 1
)

echo [2/5] 等待 MongoDB 就绪...
set MONGO_READY=0
for /l %%i in (1,1,30) do (
    if !MONGO_READY!==0 (
        docker exec gift-list-mongo mongo --eval "db.adminCommand('ping')" >nul 2>&1
        if !errorlevel!==0 set MONGO_READY=1
        if !MONGO_READY!==0 timeout /t 2 /nobreak >nul
    )
)
if %MONGO_READY%==0 (
    echo [WARN] MongoDB 可能未完全就绪，继续尝试...
)
timeout /t 3 /nobreak >nul
echo MongoDB 已就绪

REM ---------- 安装后端依赖 ----------
echo [3/5] 安装后端依赖并初始化数据...
cd /d "%~dp0backend"
if not exist node_modules (
    call npm install --no-audit --no-fund
)
set MONGO_HOST=localhost
set MONGO_PORT=%MONGO_PORT%
set MONGO_DB=gift_list_db
set PORT=%BACKEND_PORT%
call node seed.js
if errorlevel 1 (
    echo [WARN] 初始化数据失败（可能已存在数据），继续...
)

REM ---------- 安装前端依赖 ----------
echo [4/5] 安装前端依赖并构建...
cd /d "%~dp0frontend"
if not exist node_modules (
    call npm install --no-audit --no-fund
)
set REACT_APP_API_BASE=http://localhost:%BACKEND_PORT%/api
set CI=true
call npx react-scripts build
if errorlevel 1 (
    echo [ERROR] 前端构建失败
    exit /b 1
)

REM ---------- 启动后端（后台） ----------
echo [5/5] 启动后端服务...
cd /d "%~dp0backend"
start "GiftList-Backend" cmd /c "set MONGO_HOST=localhost&& set MONGO_PORT=%MONGO_PORT%&& set MONGO_DB=gift_list_db&& set PORT=%BACKEND_PORT%&& node server.js"

REM ---------- 启动前端（后台） ----------
timeout /t 2 /nobreak >nul
cd /d "%~dp0frontend"
start "GiftList-Frontend" cmd /c "set PORT=%FRONTEND_PORT%&& node serve.js"

echo.
echo ============================================
echo   启动完成！
echo   前端访问: http://localhost:%FRONTEND_PORT%
echo   后端 API: http://localhost:%BACKEND_PORT%/api
echo   MongoDB : localhost:%MONGO_PORT%
echo ============================================
echo.
echo 按任意键退出（服务将继续在后台运行）
pause >nul
endlocal
