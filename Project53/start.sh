#!/bin/bash

echo "Starting Liquor Retail Management System..."

echo "Starting MongoDB container..."
docker-compose up -d mongodb

echo "Waiting for MongoDB to start..."
sleep 5

cd backend

echo "Installing backend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Initializing database..."
node scripts/initData.js

echo "Starting backend server..."
npm start &
BACKEND_PID=$!

cd ../frontend

echo "Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "  Liquor Retail Management System Started"
echo "=========================================="
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo "  Press Ctrl+C to stop all services"
echo "=========================================="

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose down" EXIT

wait
