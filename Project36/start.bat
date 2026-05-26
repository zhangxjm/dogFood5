@echo off
echo ========================================
echo   Parking Lot Management System
echo ========================================
echo.

echo [1/3] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
)

echo [2/3] Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo [3/3] Starting server...
echo.
echo Server is running at http://localhost:5000
echo Press Ctrl+C to stop the server.
echo.
python app.py

pause
