# Hardware Shop Management System

A full-stack hardware shop product ledger management system built with Go Gin framework and MySQL.

## Features

- Product registration and management
- Purchase price and selling price tracking
- Stock management with low stock alerts
- Stock operation logs (purchase/sales)
- Price change history
- Chinese language UI

## Tech Stack

- Backend: Go 1.21, Gin framework
- Database: MySQL 8.0
- ORM: GORM
- Frontend: HTML, CSS, JavaScript
- Deployment: Docker, Docker Compose

## Project Structure

```
Project38/
├── main.go                 # Application entry point
├── go.mod                  # Go module configuration
├── database/
│   └── database.go         # Database connection
├── models/
│   └── product.go          # Data models and seed data
├── handlers/
│   └── handlers.go         # API handlers
├── templates/              # HTML templates
│   ├── index.html          # Product list page
│   ├── product_form.html   # Product form page
│   ├── stock.html          # Stock management page
│   ├── logs.html           # Operation logs page
│   └── 404.html            # Not found page
├── static/                 # Static assets
│   ├── css/style.css       # Stylesheets
│   └── js/app.js           # JavaScript
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker compose configuration
├── start.bat               # Windows startup script
├── start.sh                # Linux/Mac startup script
├── stop.bat                # Windows stop script
└── stop.sh                 # Linux/Mac stop script
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Port 8080 and 3306 available

### Windows

```batch
start.bat
```

### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

## Access

- Web Interface: http://localhost:8080
- MySQL: localhost:3306
- Database: hardware_shop
- Username: root
- Password: 123456

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock Operations

- `POST /api/products/:id/restock` - Add stock
- `POST /api/products/:id/sell` - Reduce stock (sell)

### Stock Alerts

- `GET /api/stock/alerts` - Get products with low stock

### Logs

- `GET /api/logs` - Get stock operation logs

## Database Schema

### Products Table
- id, name, category, unit
- stock, min_stock
- purchase_price, sell_price
- supplier, remark
- created_at, updated_at, deleted_at

### Stock Logs Table
- id, product_id, type (purchase/sales)
- quantity, unit_price, total_price
- operator, remark, created_at

### Price History Table
- id, product_id
- purchase_price, sell_price
- changed_at, remark

## Default Data

The system automatically initializes with sample products including:
- 扳手12mm (Wrench)
- 螺丝刀十字PH2 (Screwdriver)
- 电钻手电 (Electric Drill)
- 钢钉2.5寸 (Steel Nails)
- 膨胀螺丝M8 (Expansion Screws)
- 水管4分 (Water Pipe)
- 生料带 (PTFE Tape)
- 角磨机 (Angle Grinder)
- 卷尺5米 (Tape Measure)
- 绝缘胶带 (Insulation Tape)

## Stop Services

### Windows

```batch
stop.bat
```

### Linux/Mac

```bash
./stop.sh
```
