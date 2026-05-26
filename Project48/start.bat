@echo off
chcp 65001 >nul
echo ==========================================
echo   Poetry Appreciation Platform
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Python environment...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)

for /f "delims=" %%v in ('python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"') do set PYTHON_VERSION=%%v
echo Python version: %PYTHON_VERSION%

echo.
echo [2/5] Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo [3/5] Running database migrations...
python manage.py migrate

echo.
echo [4/5] Initializing data...
python init_data.py

echo.
echo [5/5] Starting Django development server...
echo.
echo ==========================================
echo   Server is running at http://localhost:8000
echo   Admin panel: http://localhost:8000/admin
echo   Login credentials: admin / admin123
echo   Press Ctrl+C to stop the server
echo ==========================================
echo.

python manage.py runserver 0.0.0.0:8000
pause
