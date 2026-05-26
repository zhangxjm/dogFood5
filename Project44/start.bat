@echo off
chcp 65001 >nul

echo ========================================
echo   Campus Court Reservation System
echo ========================================
echo.

echo [1/4] Checking Python environment...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher first
    pause
    exit /b 1
)
echo Python found: 
python --version

echo.
echo [2/4] Installing dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully.

echo.
echo [3/4] Initializing database...
python init_db.py
if %errorlevel% neq 0 (
    echo Error: Database initialization failed
    pause
    exit /b 1
)
echo Database initialized successfully.

echo.
echo [4/4] Starting server...
echo ========================================
echo   Server is running at http://localhost:5000
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py

pause
