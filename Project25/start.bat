@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   少儿绘画课时记录系统 - 启动脚本
echo ============================================
echo.

cd /d "%~dp0"

set "PYTHON=C:\Users\ZXJ\AppData\Local\Programs\Python\Python310\python.exe"

if not exist "%PYTHON%" (
    echo [错误] 未找到Python: %PYTHON%
    echo 请检查Python安装路径
    pause
    exit /b 1
)

set /a BACKEND_PORT=%RANDOM% * 55000 / 32768 + 10000
set /a FRONTEND_PORT=%RANDOM% * 55000 / 32768 + 10000

echo [信息] 分配端口:
echo        后端: %BACKEND_PORT%
echo        前端: %FRONTEND_PORT%
echo.

cd backend

if not exist "venv\Scripts\python.exe" (
    echo [1/3] 创建虚拟环境...
    "%PYTHON%" -m venv venv
    if errorlevel 1 (
        echo [错误] 创建虚拟环境失败
        pause
        exit /b 1
    )
    
    echo [2/3] 安装依赖...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [错误] 安装依赖失败
        pause
        exit /b 1
    )
) else (
    echo [1/3] 虚拟环境已存在
    echo [2/3] 依赖已安装
    call venv\Scripts\activate.bat
)

echo [3/3] 初始化数据库...
set DB_TYPE=sqlite
python -c "from init_data import init_data; from app import app; init_data(app)"
if errorlevel 1 (
    echo [错误] 数据库初始化失败
    pause
    exit /b 1
)

echo.
echo ============================================
echo   启动服务...
echo ============================================
echo.

set "BACKEND_CMD=set BACKEND_PORT=%BACKEND_PORT% && set DB_TYPE=sqlite && cd /d "%~dp0backend" && venv\Scripts\python.exe app.py"
start "ArtLesson Backend" cmd /c "%BACKEND_CMD%"

echo 等待后端启动...
timeout /t 3 /nobreak >nul

cd ..\frontend

set "FRONTEND_CMD=cd /d "%~dp0frontend" && "%PYTHON%" server.py %FRONTEND_PORT% %BACKEND_PORT%"
start "ArtLesson Frontend" cmd /c "%FRONTEND_CMD%"

timeout /t 2 /nobreak >nul

echo.
echo ============================================
echo   系统启动完成!
echo ============================================
echo.
echo   前端地址: http://localhost:%FRONTEND_PORT%
echo   后端地址: http://localhost:%BACKEND_PORT%
echo.
echo   初始数据已创建:
echo     - 12个学员
echo     - 6门课程
echo     - 12个排班
echo     - 多条上课记录
echo.
echo   关闭此窗口将停止服务
echo.

cd ..
cmd /k
