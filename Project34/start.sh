#!/bin/bash

echo "============================================"
echo "  Warehouse Management System - Start Script"
echo "============================================"

echo ""
echo "[1/3] Checking Docker environment..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "Docker environment is ready."

echo ""
echo "[2/3] Starting services with Docker Compose..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if docker compose version &> /dev/null; then
    docker compose down
    docker compose up -d --build
else
    docker-compose down
    docker-compose up -d --build
fi

echo ""
echo "[3/3] Waiting for services to be ready..."

echo "Waiting for MySQL to be healthy..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if docker compose ps mysql 2>/dev/null | grep -q "healthy" || docker-compose ps mysql 2>/dev/null | grep -q "healthy"; then
        echo "MySQL is healthy!"
        break
    fi
    sleep 2
    RETRY=$((RETRY + 1))
    echo "  Retry $RETRY/$MAX_RETRIES..."
done

if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "Warning: MySQL health check timeout. The service may still be starting."
fi

echo "Waiting for application to start..."
sleep 5

echo ""
echo "============================================"
echo "  Services Started Successfully!"
echo "============================================"
echo ""
echo "  Application URL: http://localhost:8080"
echo "  MySQL Port: 3306"
echo ""
echo "  To view logs: ./stop.sh logs"
echo "  To stop services: ./stop.sh"
echo "============================================"
