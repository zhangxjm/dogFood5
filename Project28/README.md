# Street Stall Sales Management System

A full-stack mobile web application for managing street stall business operations, built with Spring Boot and Vue 3.

## Features

- Daily sales recording by category
- Revenue tracking and statistics
- Hot sales ranking
- Category management
- Mobile-friendly UI

## Tech Stack

**Backend:**
- Spring Boot 2.7
- Spring Data JPA
- MySQL 8.0
- Lombok

**Frontend:**
- Vue 3
- Vant UI (Mobile Component Library)
- Vue Router
- Axios
- ECharts
- Day.js

**DevOps:**
- Docker
- Docker Compose

## Quick Start (Docker Mode)

### Prerequisites
- Docker Desktop installed and running

### Start the application

```bash
# Windows
start.bat
```

Or manually:

```bash
docker compose up -d --build
```

### Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

### Stop the application

```bash
# Windows
stop.bat
```

Or manually:

```bash
docker compose down
```

## Development Mode

### Prerequisites
- JDK 11+
- Maven 3.8+
- Node.js 18+
- Docker (for MySQL)

### Start in development mode

```bash
# Windows
start-dev.bat
```

Or manually:

1. Start MySQL:
```bash
docker run -d \
  --name stall-mysql-dev \
  -e MYSQL_ROOT_PASSWORD=root123456 \
  -e MYSQL_DATABASE=stall_db \
  -p 3306:3306 \
  mysql:8.0
```

2. Start backend:
```bash
cd backend
mvn spring-boot:run
```

3. Start frontend (in another terminal):
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
Project28/
├── backend/
│   ├── src/main/java/com/stall/
│   │   ├── controller/       # REST API controllers
│   │   ├── service/          # Business logic
│   │   ├── repository/       # Data access layer
│   │   ├── entity/           # JPA entities
│   │   ├── dto/              # Data transfer objects
│   │   └── config/           # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.yml   # App configuration
│   │   └── data.sql          # Initial data
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── views/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── api/              # API client
│   │   ├── router/           # Vue Router config
│   │   └── styles/           # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── start.bat                 # Docker start script
├── start-dev.bat             # Dev mode start script
└── stop.bat                  # Stop script
```

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/active` - List active categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Sales Records
- `GET /api/sales/date/{date}` - Get records by date
- `GET /api/sales/range?startDate=&endDate=` - Get records by date range
- `GET /api/sales/summary/{date}` - Get daily summary
- `GET /api/sales/stats` - Get overall statistics
- `GET /api/sales/total/{date}` - Get total amount by date
- `GET /api/sales/hot-sales?startDate=&endDate=` - Get hot sales ranking
- `POST /api/sales` - Create sales record
- `PUT /api/sales/{id}` - Update sales record
- `DELETE /api/sales/{id}` - Delete sales record

## Database Configuration

Default connection (Docker):
- Host: localhost
- Port: 3306
- Database: stall_db
- Username: root
- Password: root123456

## Initial Data

The system initializes with these sample categories:
- Jian Bing (Chinese crepe) - ¥8.00
- Shao Kao (BBQ skewers) - ¥3.00
- Xiaolongbao (Soup dumplings) - ¥15.00
- Stinky Tofu - ¥10.00
- Roujiamo (Chinese hamburger) - ¥12.00
- Cold Noodles - ¥8.00
- Oyster Omelet - ¥20.00
- Spicy Crayfish - ¥38.00

Sample sales records for the last 3 days are also included for demonstration.

## License

MIT License
