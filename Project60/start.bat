@echo off
echo Starting Team Building System...

echo [1/4] Starting MySQL container...
docker-compose up -d mysql

timeout /t 20 /nobreak

echo [2/4] Building backend...
cd backend
call mvn clean package -DskipTests

echo [3/4] Starting backend server...
start "Backend Server" cmd /k "java -jar target/team-building-system-1.0.0.jar"

timeout /t 15 /nobreak

echo [4/4] Starting frontend...
cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start "Frontend Server" cmd /k "npm run dev"

echo System is starting up...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo Please wait for all services to initialize completely.
pause
