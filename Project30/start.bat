@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

echo ========================================================
echo   Campus Book Exchange Platform - Full Stack Starter
echo ========================================================
echo.

echo [1/3] Checking Python...
set "PYTHON_CMD="
where python >nul 2>&1
if %errorlevel%==0 (
    for /f "delims=" %%i in ('python --version 2^>^&1') do set "PV=%%i"
    echo %PV% | findstr /i "Python 3" >nul && set "PYTHON_CMD=python"
)

if "%PYTHON_CMD%"=="" (
    if exist "%LOCALAPPDATA%\Programs\Python\Python310\python.exe" (
        set "PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
        set "PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set "PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    ) else if exist "C:\Python310\python.exe" (
        set "PYTHON_CMD=C:\Python310\python.exe"
    ) else if exist "C:\Python311\python.exe" (
        set "PYTHON_CMD=C:\Python311\python.exe"
    ) else if exist "C:\Python312\python.exe" (
        set "PYTHON_CMD=C:\Python312\python.exe"
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python 3.10+ not found. Please install Python 3.10+ and add to PATH.
    pause
    exit /b 1
)
echo       Found: %PYTHON_CMD%

echo.
echo [2/3] Setting up Backend (FastAPI)...
if not exist ".venv" (
    echo       Creating virtual environment...
    "%PYTHON_CMD%" -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)

call .venv\Scripts\activate.bat

echo       Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install Python dependencies.
        pause
        exit /b 1
    )
)
echo       Backend ready.

echo.
echo [3/3] Setting up Frontend (Vue 3 + Vite)...
where node >nul 2>&1
if errorlevel 1 (
    echo [WARN] Node.js not found. Frontend will NOT be started.
    echo        Install Node.js 18+ and re-run to enable frontend.
    echo        You can still use the backend API.
    set "SKIP_FRONTEND=1"
) else (
    cd frontend
    if not exist "node_modules" (
        echo       Installing npm dependencies...
        call npm install
        if errorlevel 1 (
            echo [ERROR] Failed to install npm dependencies.
            cd ..
            pause
            exit /b 1
        )
    )
    cd ..
    echo       Frontend ready.
    set "SKIP_FRONTEND=0"
)

echo.
echo ========================================================
echo   Starting services...
echo   Backend  API:  http://127.0.0.1:8000
echo   Backend  Docs: http://127.0.0.1:8000/docs
if "%SKIP_FRONTEND%"=="0" (
echo   Frontend App:  http://127.0.0.1:5173
)
echo   Press Ctrl+C in each window to stop.
echo ========================================================
echo.

echo [INFO] Launching Backend in new window...
start "Campus-Book-Backend" cmd /k "cd /d ""%~dp0"" && call .venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

if "%SKIP_FRONTEND%"=="0" (
    timeout /t 3 /nobreak >nul
    echo [INFO] Launching Frontend in new window...
    start "Campus-Book-Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"
)

echo.
echo [INFO] Both services launched. Close their windows to stop.
echo [INFO] Demo accounts: alice/alice123  bob/bob12345  carol/carol123
endlocal
