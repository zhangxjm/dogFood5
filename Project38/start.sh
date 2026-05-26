#!/bin/bash

echo "=========================================="
echo "  Hardware Shop Management System"
echo "=========================================="
echo ""

echo "[1/4] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi
echo "Docker check passed!"

echo ""
echo "[2/4] Stopping existing containers..."
docker-compose down 2>/dev/null || true

echo ""
echo "[3/4] Starting services..."
docker-compose up -d --build

echo ""
echo "[4/4] Waiting for services to be ready..."
echo "Waiting for MySQL..."
for i in {1..30}; do
    if docker exec hardware-mysql mysql -uroot -p123456 -e "SELECT 1" &> /dev/null; then
        echo "MySQL is ready!"
        break
    fi
    echo "Attempt $i/30..."
    sleep 2
done

echo ""
echo "Waiting for Application..."
for i in {1..20}; do
    if curl -s http://localhost:8080/ &> /dev/null; then
        echo "Application is ready!"
        break
    fi
    echo "Attempt $i/20..."
    sleep 2
done

echo ""
echo "=========================================="
echo "  System Started Successfully!"
echo "=========================================="
echo ""
echo "  Access URL: http://localhost:8080"
echo ""
echo "  MySQL Port: 3306"
echo "  MySQL User: root"
echo "  MySQL Password: 123456"
echo "  Database: hardware_shop"
echo ""
echo "=========================================="
