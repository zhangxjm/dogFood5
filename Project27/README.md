# 🎁 节日礼品清单管理系统

一个功能完整的前后端分离节日礼品清单管理系统，帮助你高效管理送礼计划。

## ✨ 功能特性

- 📋 **礼品清单管理** - 添加、编辑、删除礼品，支持分类管理
- 👥 **收礼人备注** - 记录每位收礼人的喜好和特点
- ⏰ **送礼时间提醒** - 未来3/7/14/30天内的送礼提醒
- 📜 **历史记录回看** - 查看过往送礼记录，支持恢复
- 📊 **数据概览** - 统计礼品总数、待购买、已购买、已送出等数据

## 🛠️ 技术栈

**后端:**
- Node.js + Express
- MongoDB + Mongoose
- CORS 跨域支持

**前端:**
- React 18 + Vite
- React Router 6
- Ant Design 5
- Axios + Day.js

**部署:**
- Docker + Docker Compose

## 🚀 快速开始

### 方式一：Docker 部署（推荐）

#### 前置要求
- Docker
- Docker Compose

#### 启动服务
```bash
# 给脚本添加执行权限
chmod +x start.sh

# 一键启动
./start.sh
```

或手动执行：
```bash
# 构建并启动所有服务
docker-compose up -d --build
```

#### 访问地址
- 前端界面: http://localhost:3000
- 后端API: http://localhost:5000
- 健康检查: http://localhost:5000/api/health

#### 常用命令
```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### 方式二：本地开发

#### 前置要求
- Node.js 18+
- MongoDB（本地或 Docker）

#### 启动步骤

```bash
# 给脚本添加执行权限
chmod +x start-dev.sh

# 安装依赖
./start-dev.sh

# 启动 MongoDB（如未安装）
docker run -d -p 27017:27017 mongo:6.0

# 同时启动前后端
npm run dev
```

#### 分别启动
```bash
# 仅启动后端 (端口 5000)
npm run dev:backend

# 仅启动前端 (端口 3000)
npm run dev:frontend
```

## 📁 项目结构

```
gift-manager/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── models/         # 数据模型
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   └── server.js       # 入口文件
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API 服务
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── start.sh               # Docker 启动脚本
├── start-dev.sh           # 本地开发脚本
└── package.json
```

## 🔌 API 接口

### 礼品管理
- `GET /api/gifts` - 获取礼品列表（支持筛选）
- `GET /api/gifts/:id` - 获取单个礼品
- `POST /api/gifts` - 创建礼品
- `PUT /api/gifts/:id` - 更新礼品
- `DELETE /api/gifts/:id` - 删除礼品

### 统计与提醒
- `GET /api/gifts/stats` - 获取统计数据
- `GET /api/gifts/reminders?days=7` - 获取送礼提醒
- `GET /api/gifts/recipients` - 获取所有收礼人
- `GET /api/gifts/categories` - 获取分类统计

### 查询参数
- `category` - 按分类筛选
- `status` - 按状态筛选（待购买/已购买/已送出）
- `recipient` - 按收礼人筛选
- `isHistory` - 是否为历史记录（true/false）

## 🎯 使用说明

### 添加礼品
1. 进入「礼品清单」页面
2. 点击「添加礼品」按钮
3. 填写礼品名称、分类、价格、收礼人、节日、送礼日期等信息
4. 点击「添加」完成

### 设置提醒
- 系统自动显示未来7天内需要送出的礼品
- 可在「送礼提醒」页面切换查看未来3/14/30天的提醒

### 历史记录
- 将礼品标记为「已送出」后会移至历史记录
- 可在「历史记录」页面查看和恢复

## 📝 许可证

MIT License
