@echo off
chcp 65001 >nul
echo ============================================
echo   Hard Pen Calligraphy Check-in System
echo   Local Dev Mode
echo ============================================

if not exist "uploads" mkdir uploads

echo [1/3] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo [2/3] Installing dependencies...
pip install -r requirements.txt

echo [3/3] Starting server...
echo.
echo ============================================
echo   Server is running!
echo ============================================
echo.
echo   Frontend: http://localhost:8000/frontend/
echo   API Docs: http://localhost:8000/docs
echo.
echo   Press Ctrl+C to stop
echo ============================================
echo.

uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

pause
