# 🌸 鲜花门店预订小程序

基于 NestJS + UniApp 开发的鲜花门店预订小程序，支持花束款式上架、线下到店预订、配送地址登记、预订订单查询等功能。

## 🚀 快速开始

### 环境要求

- Docker & Docker Compose
- Node.js 18+
- npm

### 一键启动

```bash
# 方式1: 使用启动脚本（推荐）
chmod +x start.sh
./start.sh

# 方式2: 手动启动
# 1. 启动数据库
docker compose up -d postgres

# 2. 启动后端
cd backend
npm install
npm run start:dev

# 3. 启动前端（新开终端）
cd frontend
npm install
npm run dev:h5
```

## 📋 功能说明

### 后端 API (NestJS)

**地址:** http://localhost:3000  
**API文档:** http://localhost:3000/api

#### 🌸 花束款式管理

- `GET /flowers` - 获取所有花束列表
- `GET /flowers/:id` - 获取花束详情
- `POST /flowers` - 上架新花束
- `PATCH /flowers/:id` - 更新花束信息
- `DELETE /flowers/:id` - 删除花束

#### 📦 预订订单管理

- `GET /orders` - 获取所有订单（支持手机号查询）
- `GET /orders/:id` - 获取订单详情
- `POST /orders` - 创建预订订单
- `PATCH /orders/:id` - 更新订单信息
- `PATCH /orders/:id/status` - 更新订单状态
- `DELETE /orders/:id` - 删除订单

#### 📍 配送地址管理

- `GET /addresses` - 获取所有地址
- `GET /addresses/:id` - 获取地址详情
- `POST /addresses` - 新增地址
- `PATCH /addresses/:id` - 更新地址
- `PATCH /addresses/:id/default` - 设为默认地址
- `DELETE /addresses/:id` - 删除地址

### 前端应用 (UniApp)

**H5地址:** http://localhost:5173

#### 页面功能

1. **花束列表页** - 浏览所有上架花束，点击查看详情或直接预订
2. **花束详情页** - 查看花束详细信息，支持立即预订
3. **订单创建页** - 填写预订信息，选择到店自取或配送到家
4. **订单列表页** - 查看所有订单，按手机号查询，管理订单状态
5. **地址列表页** - 管理配送地址，支持选择、编辑、删除
6. **地址编辑页** - 新增或编辑配送地址

## 🐳 Docker 部署

### 仅启动数据库

```bash
docker compose up -d postgres
```

### 后端 Docker 部署

```bash
# 构建并启动后端
docker compose up -d backend
```

### 完整部署

```bash
docker compose up -d
```

## 🏗️ 项目结构

```
Project19/
├── backend/                 # NestJS 后端
│   ├── src/
│   │   ├── flower/         # 花束模块
│   │   ├── order/          # 订单模块
│   │   ├── address/        # 地址模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # UniApp 前端
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index/         # 花束列表
│   │   │   ├── flower/        # 花束详情
│   │   │   ├── order/         # 订单相关
│   │   │   └── address/       # 地址相关
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── pages.json
│   │   └── manifest.json
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── start.sh
└── stop.sh
```

## 🛠️ 技术栈

### 后端

- **NestJS** - 渐进式 Node.js 框架
- **PostgreSQL** - 关系型数据库
- **TypeORM** - ORM 框架
- **Swagger** - API 文档

### 前端

- **UniApp** - 跨端框架
- **Vue 3** - 前端框架
- **Vite** - 构建工具

## 📝 开发说明

### 后端开发

```bash
cd backend
npm run start:dev    # 开发模式
npm run build        # 构建
npm run start:prod   # 生产模式
```

### 前端开发

```bash
cd frontend
npm run dev:h5             # H5 开发
npm run build:h5           # H5 构建
npm run dev:mp-weixin      # 微信小程序开发
npm run build:mp-weixin    # 微信小程序构建
```

## 🎯 API 示例

### 创建花束

```bash
curl -X POST http://localhost:3000/flowers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "浪漫红玫瑰",
    "description": "11枝精选红玫瑰",
    "price": 199,
    "image": "https://example.com/rose.jpg",
    "tags": ["热卖", "情人节"],
    "isAvailable": true,
    "stock": 50
  }'
```

### 创建订单

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "张三",
    "customerPhone": "13800138000",
    "orderType": "pickup",
    "reservationTime": "2024-05-20T10:00:00",
    "flowerId": "uuid",
    "totalPrice": 199,
    "remark": "请在上午10点准备好"
  }'
```

## 📄 许可证

MIT
