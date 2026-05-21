# 快递驿站取件系统

基于 Node.js Koa + Vue 3 + MongoDB 开发的快递驿站管理系统。

## ✨ 核心功能

- **📦 快递入库** - 录入快递信息，自动生成取件码
- **🔢 取件码生成** - 6位唯一取件码（2位字母 + 4位数字）
- **✅ 取件核销** - 手动输入取件码核销
- **⏰ 滞留件提醒** - 查看滞留件并一键电话提醒
- **📊 快递统计** - 实时统计入库、取件、取件率等数据

## 🏗️ 技术栈

### 后端
- **框架**: Koa.js
- **数据库**: MongoDB + Mongoose
- **定时任务**: node-schedule
- **时间处理**: moment.js

### 前端
- **框架**: Vue 3
- **构建工具**: Vite
- **样式**: 原生 CSS

## 🚀 快速启动

### 前置要求
- Node.js >= 14
- MongoDB（本地或 Docker）
- npm 或 yarn

### 方式一：启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动服务
npm run dev
```

后端服务将在 `http://localhost:3000` 启动

### 方式二：启动前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务
npm run dev
```

前端服务将在 `http://localhost:8080` 启动

### 方式三：使用 Docker 启动 MongoDB

```bash
# 在项目根目录
docker-compose up -d mongodb
```

## 📡 API 接口文档

### 基础地址
`http://localhost:3000/api`

### 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /express/inbound | 快递入库 |
| POST | /express/pickup | 取件核销（手动） |
| POST | /express/scan | 扫码核销 |
| GET | /express/list | 获取快递列表 |
| GET | /express/detail/:id | 获取快递详情 |
| GET | /express/statistics | 获取统计数据 |
| GET | /express/expired | 获取滞留件列表 |

### 请求示例

#### 快递入库
```bash
curl -X POST http://localhost:3000/api/express/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber": "SF1234567890",
    "courierCompany": "顺丰快递",
    "recipientName": "张三",
    "recipientPhone": "13800138000",
    "shelfLocation": "A-01"
  }'
```

#### 取件核销
```bash
curl -X POST http://localhost:3000/api/express/pickup \
  -H "Content-Type: application/json" \
  -d '{"pickupCode": "AB1234"}'
```

## 📱 前端页面说明

| 页面 | 功能 |
|------|------|
| 首页 | 功能导航、今日概览 |
| 快递入库 | 录入快递信息，自动生成取件码 |
| 取件核销 | 手动输入取件码取件 |
| 快递列表 | 查看所有快递，支持按状态筛选 |
| 数据统计 | 查看统计数据和取件率 |
| 滞留件提醒 | 查看滞留件，一键电话提醒 |

## 🔧 核心功能说明

### 取件码生成规则
- 格式：2位大写字母 + 4位数字
- 示例：AB1234
- 自动检查唯一性，确保不重复

### 滞留件规则
- 入库超过3天的快递标记为滞留件
- 入库超过5天自动标记为过期

### 状态说明
- **pending**: 待取件
- **picked**: 已取件
- **expired**: 已过期

## 📁 项目结构

```
Project1/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   └── app.js          # 入口文件
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── utils/          # 工具函数
│   │   ├── style.css       # 全局样式
│   │   ├── App.vue         # 根组件
│   │   └── main.js         # 入口文件
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml      # Docker 编排配置
└── README.md
```

## 🤝 常见问题

### 1. MongoDB 连接失败
- 检查 MongoDB 是否启动
- 检查连接地址是否正确
- 确保 27017 端口未被占用

### 2. 前端请求跨域
- Vite 已配置代理，`/api` 会转发到 `http://localhost:3000`
- 确保后端服务正常运行

## 📄 许可证

MIT
