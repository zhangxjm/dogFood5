@echo off
echo ========================================
echo   Starting Notes Application
echo ========================================
echo.

cd /d "%~dp0"

if not exist "data" mkdir data

echo [1/2] Installing Python dependencies...
pip install -r backend/requirements.txt >nul 2>&1

echo [2/2] Starting server...
echo.
echo ========================================
echo   Server is running at: http://localhost:8000
echo   Press Ctrl+C to stop
echo ========================================
echo.

cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
