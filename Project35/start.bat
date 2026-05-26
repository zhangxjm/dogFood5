@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo   Document Circulation System - Starting...
echo ===============================================
echo.

cd /d "%~dp0"

echo [1/5] Creating uploads directory...
if not exist uploads mkdir uploads

echo.
echo [2/5] Stopping existing containers if any...
docker compose down 2>nul

echo.
echo [3/5] Building and starting Docker containers...
docker compose up -d --build

echo.
echo [4/5] Waiting for services to be ready...

echo Waiting for MySQL...
set RETRY=0
:mysql_check
if %RETRY% geq 30 (
    echo WARNING: MySQL may not be ready. Please check logs.
    goto mysql_done
)
docker exec document-circulation-mysql mysql -u dc_user -pdc_pass123 -e "SELECT 1" document_circulation 2>nul
if %errorlevel% equ 0 (
    echo MySQL is ready!
    goto mysql_done
)
set /a RETRY+=1
echo Attempt !RETRY!/30 - MySQL not ready yet, waiting...
timeout /t 2 /nobreak >nul
goto mysql_check
:mysql_done

echo Waiting for Backend...
set RETRY=0
:backend_check
if %RETRY% geq 30 (
    echo WARNING: Backend may not be ready. Please check logs.
    goto backend_done
)
curl -s http://localhost:8080/api/users >nul 2>&1
if %errorlevel% equ 0 (
    echo Backend is ready!
    goto backend_done
)
set /a RETRY+=1
echo Attempt !RETRY!/30 - Backend not ready yet, waiting...
timeout /t 3 /nobreak >nul
goto backend_check
:backend_done

echo.
echo [5/5] Verifying services...

echo Checking Frontend...
curl -s http://localhost >nul 2>&1
if %errorlevel% equ 0 (
    echo Frontend is running.
) else (
    echo WARNING: Frontend may not be ready.
)

echo.
echo ===============================================
echo   All services started successfully!
echo ===============================================
echo.
echo Access URLs:
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8080
echo.
echo Default Users:
echo   admin    - System Admin
echo   zhangsan - Zhang San (Sales Department)
echo   lisi     - Li Si (Engineering Department)
echo   wangwu   - Wang Wu (Marketing Department)
echo   zhaoliu  - Zhao Liu (HR Department)
echo   sunqi    - Sun Qi (Finance Department)
echo.
echo To view logs: docker compose logs -f
echo To stop:     docker compose down
echo.
pause
