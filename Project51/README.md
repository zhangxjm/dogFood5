# Hotel Linen Management System

## Project Structure
```
Project51/
├── backend/                 # Spring Boot 2.7 backend
│   ├── pom.xml
│   └── src/main/java/com/hotel/linen/
├── frontend/                # Vue 3 + Element Plus frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── docker/                  # Docker Compose for MySQL
│   └── docker-compose.yml
├── startup.bat              # Windows startup script
└── startup.sh               # Linux/Mac startup script
```

## Prerequisites
- Docker and Docker Compose
- Java 8+
- Maven 3.6+
- Node.js 16+
- npm

## Quick Start

### Windows
```cmd
startup.bat
```

### Linux/Mac
```bash
chmod +x startup.sh
./startup.sh
```

## Manual Startup

### 1. Start MySQL
```bash
cd docker
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on http://localhost:8080

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Features
- Inventory management (stock tracking, clean/dirty/in-use status)
- Cleaning registration (track washing operations)
- Usage tracking (checkout and return)
- Loss recording (damage and loss tracking)
- Dashboard with statistics and charts

## Database
- MySQL 8.0
- Database: hotel_linen
- Username: root
- Password: root
- Port: 3306
