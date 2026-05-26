#!/bin/bash

echo "============================================"
echo "  ScoreShare - Sheet Music Sharing Platform"
echo "============================================"
echo ""

echo "[1/4] Checking Python installation..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "ERROR: Python is not installed or not in PATH."
    echo "Please install Python 3.8+"
    exit 1
fi

PYTHON=$(command -v python3 || command -v python)
$PYTHON --version
echo "Python is installed."

echo ""
echo "[2/4] Creating virtual environment..."
if [ ! -d "venv" ]; then
    $PYTHON -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

echo ""
echo "[3/4] Installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies."
    exit 1
fi
echo "Dependencies installed."

echo ""
echo "[4/4] Starting the application..."
echo ""
echo "============================================"
echo "  Server started successfully!"
echo "  URL: http://localhost:5000"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

$PYTHON run.py
