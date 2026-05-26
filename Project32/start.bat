@echo off
chcp 65001 >nul
echo ============================================
echo   ScoreShare - Sheet Music Sharing Platform
echo ============================================
echo.

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
echo Python is installed.

echo.
echo [2/4] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo [3/4] Installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)
echo Dependencies installed.

echo.
echo [4/4] Starting the application...
echo.
echo ============================================
echo   Server started successfully!
echo   URL: http://localhost:5000
echo ============================================
echo.
echo Press Ctrl+C to stop the server.
echo.

python run.py

pause
