#!/bin/bash

echo "========================================"
echo "Dormitory Management System - Startup"
echo "========================================"
echo ""

echo "[1/5] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker first"
    exit 1
fi
echo "Docker is available"
echo ""

echo "[2/5] Starting MySQL container..."
docker compose up -d mysql
if [ $? -ne 0 ]; then
    docker-compose up -d mysql
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to start MySQL container"
        exit 1
    fi
fi
echo "MySQL container started"
echo ""

echo "[3/5] Waiting for MySQL to be ready..."
sleep 15
echo "MySQL should be ready now"
echo ""

echo "[4/5] Starting backend service..."
cd backend

if [ ! -f "go.sum" ]; then
    echo "Downloading Go dependencies..."
    go mod download
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to download dependencies"
        exit 1
    fi
fi

echo "Building and running application..."
go run main.go
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start application"
    exit 1
fi

cd ..
echo ""
echo "========================================"
echo "Application started successfully!"
echo "Open http://localhost:8080 in your browser"
echo "========================================"
