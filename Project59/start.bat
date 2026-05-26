@echo off
echo ========================================
echo Music School Booking System - Start Script
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo.
echo Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Failed to create virtual environment.
        pause
        exit /b 1
    )
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Initializing database...
python init_db.py
if %errorlevel% neq 0 (
    echo Failed to initialize database.
    pause
    exit /b 1
)

echo.
echo Starting server...
echo Server will be available at http://localhost:8000
echo API documentation: http://localhost:8000/docs
echo Press Ctrl+C to stop the server.
echo.

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
