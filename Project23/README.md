# 🐾 宠物用品线下门店管理系统

基于 Express + Vue3 开发的宠物用品门店管理系统，支持商品分类管理、价格调整、销售记录、热销商品统计等功能。

## ✨ 功能特性

- 📦 **商品分类管理** - 添加、编辑、删除商品分类
- 🛍️ **商品管理** - 商品信息维护，支持价格调整
- 💰 **价格调整** - 单独的价格调整功能，操作便捷
- 📝 **线下销售记录** - 记录销售，自动扣减库存
- 📊 **热销商品统计** - 可视化展示商品销售排行

## 🛠️ 技术栈

### 后端
- Node.js + Express
- SQLite3 + Sequelize ORM
- CORS 跨域支持

### 前端
- Vue 3 + Vite
- Vue Router 路由管理
- Element Plus UI 组件库
- Axios HTTP 请求

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

#### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

#### Windows
```cmd
start.bat
```

### 方式二：手动启动

#### 启动后端服务
```bash
cd backend
npm install
npm start
```
后端运行在 `http://localhost:3000`

#### 启动前端服务
```bash
cd frontend
npm install
npm run dev
```
前端运行在 `http://localhost:5173`

### 方式三：Docker 部署

```bash
docker-compose up -d
```

## 📁 项目结构

```
.
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── database.js     # 数据库配置
│   │   ├── index.js        # 入口文件
│   │   └── routes/         # API路由
│   ├── package.json
│   └── Dockerfile
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── api/            # API封装
│   │   └── main.js
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── start.sh               # Linux/macOS 启动脚本
├── start.bat              # Windows 启动脚本
└── README.md
```

## 🔌 API 接口

### 分类管理
- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

### 商品管理
- `GET /api/products` - 获取所有商品
- `POST /api/products` - 创建商品
- `PUT /api/products/:id` - 更新商品
- `PUT /api/products/:id/price` - 调整价格
- `DELETE /api/products/:id` - 删除商品
- `GET /api/products/stats/hot` - 热销商品

### 销售管理
- `GET /api/sales` - 获取销售记录
- `POST /api/sales` - 创建销售记录
- `DELETE /api/sales/:id` - 撤销销售记录

## 📝 说明

1. 系统默认会初始化一些示例数据（4个分类，4个商品）
2. 数据库使用 SQLite，数据存储在 `backend/database.sqlite`
3. 撤销销售记录时会自动恢复库存

## 🌐 访问地址

- 前端页面: http://localhost:5173
- 后端API: http://localhost:3000
