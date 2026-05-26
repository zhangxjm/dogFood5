#!/bin/bash

echo "============================================"
echo "  Hotel Linen Management System Startup"
echo "============================================"
echo ""

echo "[1/4] Starting MySQL container..."
cd "$(dirname "$0")/docker"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "Failed to start MySQL. Please ensure Docker is running."
    exit 1
fi
echo "MySQL container started successfully."
echo ""

echo "[2/4] Waiting for MySQL to be ready..."
sleep 15
echo ""

echo "[3/4] Starting Spring Boot backend..."
cd "$(dirname "$0")/backend"
mvn spring-boot:run &
BACKEND_PID=$!
echo "Backend starting on port 8080 (PID: $BACKEND_PID)..."
echo ""

echo "[4/4] Starting Vue frontend..."
cd "$(dirname "$0")/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
echo "Frontend starting on port 5173 (PID: $FRONTEND_PID)..."
echo ""

echo "============================================"
echo "  Startup Complete!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080"
echo "  Press Ctrl+C to stop all services"
echo "============================================"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; cd $(dirname "$0")/docker && docker-compose down; exit" INT TERM
wait
