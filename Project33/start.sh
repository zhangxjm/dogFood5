#!/bin/bash

echo "============================================"
echo "  Plant Care Service System - Startup Script"
echo "============================================"
echo ""

echo "[1/4] Checking Node.js environment..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi
echo "Node.js version: $(node --version)"

echo ""
echo "[2/4] Installing backend dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Backend dependency installation failed"
        exit 1
    fi
else
    echo "Backend dependencies already installed"
fi
cd ..

echo ""
echo "[3/4] Installing frontend dependencies..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Frontend dependency installation failed"
        exit 1
    fi
else
    echo "Frontend dependencies already installed"
fi
cd ..

echo ""
echo "[4/4] Starting services..."
echo ""

echo "Starting backend server on port 3001..."
cd server && npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend dev server on port 5173..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  System is starting up..."
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:3001/api"
echo "============================================"
echo ""

echo "Press Ctrl+C to stop all services"
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped'; exit 0" SIGINT SIGTERM

wait
