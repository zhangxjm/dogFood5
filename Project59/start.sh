#!/bin/bash

echo "========================================"
echo "Music School Booking System - Start Script"
echo "========================================"
echo ""

cd "$(dirname "$0")/backend"

echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

python3 --version
echo ""

echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "Failed to create virtual environment."
        exit 1
    fi
fi

echo ""
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies."
    exit 1
fi

echo ""
echo "Initializing database..."
python init_db.py
if [ $? -ne 0 ]; then
    echo "Failed to initialize database."
    exit 1
fi

echo ""
echo "Starting server..."
echo "Server will be available at http://localhost:8000"
echo "API documentation: http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server."
echo ""

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
