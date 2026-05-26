#!/bin/bash

echo "========================================"
echo "Music School Booking System - Docker Start"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed or not running."
    echo "Please install Docker and start it first."
    exit 1
fi

docker --version
echo ""

echo "Creating data directory..."
mkdir -p backend/data

echo ""
echo "Building and starting containers..."
docker-compose up -d --build

echo ""
echo "Waiting for service to start..."
sleep 10

echo ""
echo "========================================"
echo "Service started successfully!"
echo "========================================"
echo ""
echo "Application URL: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo ""
