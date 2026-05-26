@echo off
chcp 65001 >nul
echo ========================================
echo   Street Stall System - Dev Mode
echo ========================================
echo.

echo [1/3] Starting MySQL via Docker...
docker run -d ^
  --name stall-mysql-dev ^
  -e MYSQL_ROOT_PASSWORD=root123456 ^
  -e MYSQL_DATABASE=stall_db ^
  -p 3306:3306 ^
  mysql:8.0 ^
  --default-authentication-plugin=mysql_native-password ^
  --character-set-server=utf8mb4 ^
  --collation-server=utf8mb4_unicode_ci

echo Waiting for MySQL to start...
timeout /t 15 /nobreak >nul

echo.
echo [2/3] Starting backend (SpringBoot)...
cd backend
start "Backend" mvn spring-boot:run
cd ..

echo.
echo [3/3] Starting frontend (Vue3)...
cd frontend
start "Frontend" npm run dev
cd ..

echo.
echo ========================================
echo   Dev Mode Started!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080/api
echo.
echo To stop: close the terminal windows and run:
echo   docker stop stall-mysql-dev
echo.
pause
