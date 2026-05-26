#!/bin/bash

echo "Starting River Inspection System..."
echo ""

echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed or not running. Please install Docker first."
    exit 1
fi

echo ""
echo "Building and starting containers..."
docker-compose up -d --build

echo ""
echo "Waiting for services to start..."
sleep 20

echo ""
echo "========================================"
echo "River Inspection System is ready!"
echo "Please visit: http://localhost:8080"
echo "========================================"
echo ""
echo "To stop the system, run: ./stop.sh"
