# Plant Care Service Booking System

A full-stack plant care service booking system built with Koa.js and Vue3.

## Features

- Service management (CRUD for plant care services)
- Appointment booking (users can book on-site services)
- Service completion records
- Service review and rating system
- Statistics dashboard

## Tech Stack

**Backend:**
- Koa.js - Node.js web framework
- better-sqlite3 - SQLite database
- koa-router - REST API routing
- koa-bodyparser - Request body parsing

**Frontend:**
- Vue 3 - Progressive JavaScript framework
- Element Plus - UI component library
- Vue Router - Client-side routing
- Axios - HTTP client
- Vite - Build tool and dev server

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Using Startup Script

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Manual Startup

1. Install backend dependencies:
```bash
cd server
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Start backend server (runs on port 3001):
```bash
cd server
npm start
```

4. Start frontend dev server (runs on port 5173):
```bash
cd client
npm run dev
```

5. Open your browser and visit: http://localhost:5173

### Using Docker

```bash
docker-compose up -d
```

The frontend will be available at: http://localhost:8080

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/complete` - Complete appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Records
- `GET /api/records` - Get all service records
- `GET /api/records/:id` - Get record by ID

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/appointment/:appointment_id` - Get review by appointment
- `POST /api/reviews` - Create new review

### Statistics
- `GET /api/stats` - Get system statistics

## Database

The system uses SQLite database (file: `server/src/plant_care.db`).

Database is automatically initialized on first startup with sample plant care services.

## Project Structure

```
.
├── server/                 # Backend code
│   ├── src/
│   │   ├── app.js         # Koa server entry point
│   │   ├── database.js    # Database configuration
│   │   ├── initData.js    # Sample data initialization
│   │   ├── controllers/   # Request handlers
│   │   └── routes/        # API route definitions
│   └── package.json
├── client/                # Frontend code
│   ├── src/
│   │   ├── views/         # Page components
│   │   ├── api/           # API service layer
│   │   ├── router/        # Vue Router config
│   │   └── App.vue        # Root component
│   └── package.json
├── docker-compose.yml     # Docker configuration
├── start.bat             # Windows startup script
└── start.sh              # Linux/Mac startup script
```
