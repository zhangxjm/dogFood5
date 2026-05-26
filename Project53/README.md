# Liquor Retail Management System

Node.js前后端分离酒水零售管理系统

## Features

- 酒水品类管理
- 酒水库存管理
- 售卖记录管理
- 临期酒水提醒
- 数据统计看板

## Tech Stack

- Backend: Node.js + Express + MongoDB
- Frontend: Vue 3 + Ant Design Vue
- Database: MongoDB (Docker)

## Quick Start

### Prerequisites

- Node.js >= 16
- Docker and Docker Compose

### Windows

```
start.bat
```

### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

## Manual Start

1. Start MongoDB:
```bash
docker-compose up -d mongodb
```

2. Start Backend:
```bash
cd backend
npm install
node scripts/initData.js
npm start
```

3. Start Frontend (new terminal):
```bash
cd frontend
npm install
npm run dev
```

## Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure

```
.
├── backend/          # Node.js Express backend
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── controllers/
│   │   ├── models/   # Mongoose models
│   │   ├── routes/
│   │   └── index.js  # Server entry
│   └── scripts/      # Init data script
├── frontend/         # Vue 3 frontend
│   ├── src/
│   │   ├── pages/    # Vue pages
│   │   ├── services/ # API services
│   │   └── App.vue
│   └── vite.config.js
├── docker-compose.yml
└── start.bat / start.sh
```
