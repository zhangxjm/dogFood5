@echo off
chcp 65001 >nul
echo ==========================================
echo   Hardware Shop Management System
echo ==========================================
echo.

echo [1/4] Checking Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed
    pause
    exit /b 1
)

echo Docker check passed!
echo.

echo [2/4] Stopping existing containers...
docker-compose down 2>nul
echo.

echo [3/4] Starting services...
docker-compose up -d --build
echo.

echo [4/4] Waiting for services to be ready...
echo Waiting for MySQL...
set retry=0
:wait_mysql
set /a retry+=1
if %retry% gtr 30 (
    echo Warning: MySQL startup timeout, please check manually
    goto :mysql_done
)
docker exec hardware-mysql mysql -uroot -p123456 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo Attempt %retry%/30...
    timeout /t 2 /nobreak >nul
    goto :wait_mysql
)
echo MySQL is ready!
:mysql_done
echo.

echo Waiting for Application...
set retry=0
:wait_app
set /a retry+=1
if %retry% gtr 20 (
    echo Warning: Application startup timeout
    goto :app_done
)
curl -s http://localhost:8080/ >nul 2>&1
if %errorlevel% neq 0 (
    echo Attempt %retry%/20...
    timeout /t 2 /nobreak >nul
    goto :wait_app
)
echo Application is ready!
:app_done
echo.

echo ==========================================
echo   System Started Successfully!
echo ==========================================
echo.
echo   Access URL: http://localhost:8080
echo.
echo   MySQL Port: 3306
echo   MySQL User: root
echo   MySQL Password: 123456
echo   Database: hardware_shop
echo.
echo ==========================================
echo.
pause
