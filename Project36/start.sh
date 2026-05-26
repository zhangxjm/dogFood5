#!/bin/bash
echo "========================================"
echo "  Parking Lot Management System"
echo "========================================"
echo ""

echo "[1/3] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo "[2/3] Installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo "[3/3] Starting server..."
echo ""
echo "Server is running at http://localhost:5000"
echo "Press Ctrl+C to stop the server."
echo ""
python3 app.py
