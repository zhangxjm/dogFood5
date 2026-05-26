#!/bin/bash

echo "========================================"
echo "River Inspection System - Local Mode"
echo "========================================"
echo ""

echo "Checking Go environment..."
if ! command -v go &> /dev/null; then
    echo "Go is not installed. Please install Go first."
    echo "Download from: https://golang.org/dl/"
    exit 1
fi

echo "Go version:"
go version
echo ""

cd "$(dirname "$0")/backend"

echo "Setting Go proxy..."
export GOPROXY=https://goproxy.cn,direct

echo "Downloading dependencies..."
go mod tidy
if [ $? -ne 0 ]; then
    echo "Failed to download dependencies."
    exit 1
fi

echo ""
echo "Building application..."
go build -o inspection-server .
if [ $? -ne 0 ]; then
    echo "Build failed."
    exit 1
fi

echo ""
echo "Starting server..."
echo "Please visit: http://localhost:8080"
echo "Press Ctrl+C to stop the server."
echo ""

./inspection-server
