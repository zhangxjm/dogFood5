# 工地材料领用管理系统

基于 Go Gin + Vue 3 + Element Plus + MySQL 开发的工地材料领用登记平台。

## 功能特性

- **材料管理**: 材料的增删改查
- **班组管理**: 班组的增删改查
- **领用/归还登记**: 材料领用和归还登记，自动更新库存
- **台账查询**: 多条件筛选查询领用记录

## 技术栈

- **后端**: Go 1.21+, Gin, GORM
- **前端**: Vue 3, Element Plus, Axios
- **数据库**: MySQL 8.0
- **容器化**: Docker Compose

## 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x start.sh

# 运行脚本
./start.sh
```

### 方式二：手动启动

#### 1. 启动 MySQL 数据库

```bash
docker compose up -d
```

#### 2. 启动后端服务

```bash
cd backend
go mod download
go run main.go
```

后端服务运行在: http://localhost:8080

#### 3. 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在: http://localhost:3000

## 项目结构

```
.
├── backend/
│   ├── main.go          # 程序入口
│   ├── config/          # 配置文件
│   ├── models/          # 数据模型
│   ├── controllers/     # 控制器
│   ├── routers/         # 路由
│   └── sql/             # 数据库初始化脚本
├── frontend/
│   ├── src/
│   │   ├── views/       # 页面组件
│   │   ├── router/      # 路由配置
│   │   ├── api/         # API 封装
│   │   └── App.vue      # 根组件
│   └── package.json
├── docker compose.yml
└── start.sh
```

## 默认数据

系统启动后会自动初始化以下测试数据：

### 材料

- 水泥 (P.O 42.5) - 500袋
- 钢筋 (Φ16) - 50吨
- 红砖 - 10000块
- 沙子 - 200立方米
- 石子 - 150立方米

### 班组

- 土建一班 (张三)
- 土建二班 (李四)
- 水电班 (王五)
- 装修班 (赵六)

## 数据库配置

- 主机: localhost
- 端口: 3306
- 数据库: material_manage
- 用户名: material_user
- 密码: material_pass
