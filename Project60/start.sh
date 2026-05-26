#!/bin/bash
echo "Starting Team Building System..."

echo "[1/4] Starting MySQL container..."
docker-compose up -d mysql

sleep 20

echo "[2/4] Building backend..."
cd backend
mvn clean package -DskipTests

echo "[3/4] Starting backend server..."
java -jar target/team-building-system-1.0.0.jar &
BACKEND_PID=$!

sleep 15

echo "[4/4] Starting frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo "System is starting up..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "Please wait for all services to initialize completely."

wait $BACKEND_PID $FRONTEND_PID
