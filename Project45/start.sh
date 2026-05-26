#!/bin/bash

echo "========================================"
echo "  Travel Planner System"
echo "========================================"
echo ""

echo "[INFO] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "[INFO] Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[INFO] Node.js version: $(node --version)"

echo ""
echo "[INFO] Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed or not in PATH"
    exit 1
fi

echo "[INFO] npm version: $(npm --version)"

echo ""
echo "[INFO] Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        exit 1
    fi
else
    echo "[INFO] node_modules already exists, skipping install"
fi

echo ""
echo "[INFO] Starting Travel Planner Server..."
echo "[INFO] Server will be available at http://localhost:3000"
echo "[INFO] Press Ctrl+C to stop the server"
echo ""

node src/server.js
