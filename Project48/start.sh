#!/bin/bash

set -e

echo "=========================================="
echo "Poetry Appreciation Platform - Start Script"
echo "=========================================="

cd "$(dirname "$0")"

echo "[1/5] Checking Python environment..."
if ! command -v python &> /dev/null; then
    echo "Python is not installed. Please install Python 3.8+"
    exit 1
fi

PYTHON_VERSION=$(python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Python version: $PYTHON_VERSION"

echo "[2/5] Installing dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "[3/5] Running database migrations..."
python manage.py migrate

echo "[4/5] Initializing data..."
python init_data.py

echo "[5/5] Starting Django development server..."
echo ""
echo "=========================================="
echo "  Server is running at http://localhost:8000"
echo "  Admin panel: http://localhost:8000/admin"
echo "  Login credentials: admin / admin123"
echo "  Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

python manage.py runserver 0.0.0.0:8000
