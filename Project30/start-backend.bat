@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

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
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python 3.10+ not found.
    pause
    exit /b 1
)

if not exist ".venv" (
    echo [INFO] Creating virtual environment...
    "%PYTHON_CMD%" -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)

call .venv\Scripts\activate.bat

echo [INFO] Installing dependencies...
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    pip install -r requirements.txt
)

echo [INFO] Starting Backend on http://127.0.0.1:8000
echo [INFO] Docs: http://127.0.0.1:8000/docs
echo [INFO] Press Ctrl+C to stop.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

endlocal
