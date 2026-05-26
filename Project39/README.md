# Orchard Reservation System

A full-stack orchard reservation system built with Spring Boot and UniApp.

## Project Structure

```
Project39/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/orchard/
│   │       │   ├── controller/    # REST API controllers
│   │       │   ├── entity/        # JPA entities
│   │       │   ├── repository/    # Data access layer
│   │       │   ├── service/       # Business logic
│   │       │   └── config/        # Configuration
│   │       └── resources/
│   │           ├── application.yml
│   │           └── data.sql       # Initial data
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # UniApp frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── api/             # API requests
│   │   ├── utils/           # Utilities
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── manifest.json
│   │   └── pages.json
│   ├── package.json
│   └── vue.config.js
├── docker-compose.yml       # Docker configuration
└── start.bat                # Startup script
```

## Features

- Time slot management for park entry
- Visitor reservation system
- Entry verification
- Picking category introduction

## Quick Start

### Prerequisites

- Java 8+
- Maven 3.6+
- Node.js 14+
- Docker and Docker Compose
- MySQL 8.0 (or use Docker)

### Start Backend

1. Start MySQL using Docker:
   ```
   docker compose up -d mysql
   ```

2. Build and run the backend:
   ```
   cd backend
   mvn clean package -DskipTests
   java -jar target/orchard-backend-1.0.0.jar
   ```

Or use the startup script:
   ```
   start.bat
   ```

### Start Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run H5 development server:
   ```
   npm run dev:h5
   ```

3. Build for WeChat Mini Program:
   ```
   npm run build:mp-weixin
   ```

## API Endpoints

### Categories
- GET /api/categories - Get all categories
- GET /api/categories/{id} - Get category by ID
- POST /api/categories - Create category
- PUT /api/categories/{id} - Update category
- DELETE /api/categories/{id} - Delete category

### Time Slots
- GET /api/time-slots/date/{date} - Get time slots by date
- GET /api/time-slots/range - Get time slots by date range
- GET /api/time-slots/{id} - Get time slot by ID
- POST /api/time-slots - Create time slot
- PUT /api/time-slots/{id} - Update time slot
- DELETE /api/time-slots/{id} - Delete time slot

### Reservations
- POST /api/reservations - Create reservation
- GET /api/reservations/order/{orderNo} - Get reservation by order number
- GET /api/reservations/phone/{phone} - Get reservations by phone
- POST /api/reservations/verify/{orderNo} - Verify reservation
- POST /api/reservations/cancel/{orderNo} - Cancel reservation
- GET /api/reservations - Get all reservations

## Default Data

The system initializes with:
- 6 fruit/vegetable categories
- 7 days of time slots (4 slots per day)
- Default price: 20 CNY/person

## Access

- Backend API: http://localhost:8080/api
- H5 Frontend: http://localhost:8081
