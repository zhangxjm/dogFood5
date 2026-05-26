#!/bin/bash

set -e

echo "==============================================="
echo "  Document Circulation System - Starting..."
echo "==============================================="

PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$PROJECT_DIR"

echo ""
echo "[1/5] Creating uploads directory..."
mkdir -p uploads

echo ""
echo "[2/5] Stopping existing containers if any..."
docker compose down 2>/dev/null || true

echo ""
echo "[3/5] Building and starting Docker containers..."
docker compose up -d --build

echo ""
echo "[4/5] Waiting for services to be ready..."

echo "Waiting for MySQL..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if docker exec document-circulation-mysql mysql -u dc_user -pdc_pass123 -e "SELECT 1" document_circulation 2>/dev/null; then
        echo "MySQL is ready!"
        break
    fi
    RETRY=$((RETRY + 1))
    echo "Attempt $RETRY/$MAX_RETRIES - MySQL not ready yet, waiting..."
    sleep 2
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "WARNING: MySQL may not be ready. Please check logs."
fi

echo "Waiting for Backend..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    RETRY=$((RETRY + 1))
    echo "Attempt $RETRY/$MAX_RETRIES - Backend not ready yet, waiting..."
    sleep 3
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "WARNING: Backend may not be ready. Please check logs."
fi

echo ""
echo "[5/5] Verifying services..."

echo "Checking Frontend..."
if curl -s http://localhost > /dev/null 2>&1; then
    echo "Frontend is running."
else
    echo "WARNING: Frontend may not be ready."
fi

echo ""
echo "==============================================="
echo "  All services started successfully!"
echo "==============================================="
echo ""
echo "Access URLs:"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8080"
echo "  API Docs: http://localhost:8080/api"
echo ""
echo "Default Users:"
echo "  admin    - System Admin"
echo "  zhangsan - Zhang San (Sales Department)"
echo "  lisi     - Li Si (Engineering Department)"
echo "  wangwu   - Wang Wu (Marketing Department)"
echo "  zhaoliu  - Zhao Liu (HR Department)"
echo "  sunqi    - Sun Qi (Finance Department)"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop:     docker compose down"
echo ""
