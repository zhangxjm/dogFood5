# 设备维修报修系统

基于 Go Fiber + Vue3 + Element Plus + MySQL 构建的设备维修管理系统。

## 功能特性

### 核心功能
- 📱 **设备台账** - 设备信息管理，支持增删改查
- 📝 **报修申请** - 用户提交设备故障报修
- 🔧 **维修派单** - 管理员分配维修任务
- 📋 **维修记录** - 维修人员处理和记录维修过程
- 📊 **故障统计** - 数据可视化展示维修统计

### 流程管理
- 报修申请 → 待派单 → 已派单 → 维修中 → 已完成
- 支持报修取消
- 支持维修进度跟踪

## 技术栈

### 后端
- Go 1.21
- Go Fiber v2
- GORM ORM
- JWT 认证
- MySQL

### 前端
- Vue 3
- Element Plus
- Vue Router
- Axios
- ECharts

### 中间件
- Docker
- MySQL 8.0
- phpMyAdmin

## 快速开始

### 环境要求
- Docker & Docker Compose
- Go 1.21+
- Node.js 18+
- npm 或 yarn

### 一键启动

#### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

#### Windows
```cmd
start.bat
```

### 手动启动

#### 1. 启动数据库
```bash
docker-compose up -d
```

#### 2. 启动后端服务
```bash
cd backend
go mod tidy
go run main.go
```

#### 3. 启动前端服务
```bash
cd frontend
npm install
npm run dev
```

## 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:5173 | 系统主界面 |
| 后端API | http://localhost:3000 | API接口服务 |
| phpMyAdmin | http://localhost:8080 | 数据库管理 |

## 默认账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | 123456 | 管理员 | 拥有所有权限 |
| user1 | 123456 | 普通用户 | 可提交报修 |
| tech1 | 123456 | 维修人员 | 可处理维修任务 |
| tech2 | 123456 | 维修人员 | 可处理维修任务 |

## 项目结构

```
.
├── backend/                 # 后端 Go Fiber 项目
│   ├── controllers/        # 控制器
│   ├── database/           # 数据库配置和初始化
│   ├── models/             # 数据模型
│   ├── routes/             # 路由配置
│   ├── .env               # 环境变量
│   ├── go.mod             # Go 依赖
│   └── main.go            # 入口文件
├── frontend/              # 前端 Vue3 项目
│   ├── src/
│   │   ├── views/        # 页面组件
│   │   ├── router/       # 路由配置
│   │   ├── api/          # API 封装
│   │   ├── App.vue       # 根组件
│   │   └── main.js       # 入口文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml     # Docker 配置
├── start.sh              # Linux/macOS 启动脚本
├── start.bat             # Windows 启动脚本
└── README.md             # 项目说明
```

## API 接口

### 认证
- `POST /api/login` - 用户登录

### 设备管理
- `GET /api/devices` - 获取设备列表
- `GET /api/devices/:id` - 获取设备详情
- `POST /api/devices` - 创建设备
- `PUT /api/devices/:id` - 更新设备
- `DELETE /api/devices/:id` - 删除设备

### 报修申请
- `GET /api/repair-requests` - 获取报修列表
- `POST /api/repair-requests` - 提交报修
- `POST /api/repair-requests/:id/cancel` - 取消报修

### 派单管理
- `GET /api/assignments/technicians` - 获取维修人员
- `GET /api/assignments` - 获取派单列表
- `POST /api/assignments` - 创建派单

### 维修记录
- `GET /api/records` - 获取维修记录
- `POST /api/records/:id/start` - 开始维修
- `POST /api/records/:id/complete` - 完成维修

### 统计
- `GET /api/stats` - 获取统计数据

## 数据库配置

- 数据库名: `repair_system`
- 用户名: `repair_user`
- 密码: `repair_password`
- 端口: `3306`

## 许可证

MIT
