#!/bin/bash

echo "============================================"
echo "  ScoreShare - Docker Compose Setup"
echo "============================================"
echo ""

echo "[1/3] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH."
    echo "Please install Docker from https://docs.docker.com/"
    exit 1
fi
docker --version

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "ERROR: Docker Compose is not installed."
    echo "Please install Docker Compose from https://docs.docker.com/compose/"
    exit 1
fi
echo "Docker is installed."

echo ""
echo "[2/3] Building and starting containers..."
if docker compose version &> /dev/null 2>&1; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start containers."
    exit 1
fi

echo ""
echo "[3/3] Waiting for server to be ready..."
sleep 3

echo ""
echo "============================================"
echo "  Server started successfully!"
echo "  URL: http://localhost:5000"
echo "============================================"
echo ""
echo "Use 'docker compose down' to stop the server."
echo ""
