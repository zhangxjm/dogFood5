#!/bin/bash

echo "========================================"
echo "  Agricultural Tool Management System"
echo "  Starting Services..."
echo "========================================"
echo ""

echo "[1/3] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    echo "Please install Docker first: https://www.docker.com"
    exit 1
fi

echo "[2/3] Starting MySQL and Application..."
docker-compose up -d --build

echo ""
echo "[3/3] Waiting for services to be ready..."
sleep 15

echo ""
echo "========================================"
echo "  Services Started Successfully!"
echo "========================================"
echo ""
echo "  Application URL: http://localhost:8080"
echo "  MySQL Port: 3306"
echo ""
echo "  To stop services, run: docker-compose down"
echo "  To view logs, run: docker-compose logs -f"
echo ""
echo "========================================"
