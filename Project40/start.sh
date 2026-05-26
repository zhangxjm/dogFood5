#!/bin/bash

echo "============================================"
echo "  Hard Pen Calligraphy Check-in System"
echo "  Starting..."
echo "============================================"

mkdir -p uploads

echo "[1/2] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Please install Docker first."
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi

echo "Docker is ready!"

echo "[2/2] Starting services..."
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo "Failed to start services!"
    exit 1
fi

echo ""
echo "============================================"
echo "  Services started successfully!"
echo "============================================"
echo ""
echo "  Frontend: http://localhost:8000/frontend/"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  To stop: ./stop.sh"
echo "============================================"
