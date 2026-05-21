# 🏋️ 健身计划管理系统

基于 NestJS + React + PostgreSQL 的全栈健身计划管理系统，支持自定义健身方案、每日打卡、月度数据统计。

## ✨ 功能特性

### 📋 健身方案管理
- 创建、编辑、删除健身方案
- 自定义多个训练动作
- 支持设置每组次数、组数

### ✅ 每日打卡
- 选择健身方案进行打卡
- 记录完成的训练动作
- 记录消耗卡路里和运动时长
- 添加打卡备注
- 按日期查看打卡记录

### 📊 数据统计
- 月度数据汇总统计
- 每日卡路里消耗趋势图
- 各健身方案使用统计
- 打卡历史记录表格

## 🛠️ 技术栈

### 后端
- **NestJS** - 渐进式 Node.js 框架
- **TypeORM** - ORM 框架
- **PostgreSQL** - 关系型数据库
- **Swagger** - API 文档

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Tailwind CSS** - 样式框架
- **Recharts** - 图表库
- **Axios** - HTTP 客户端

## 🚀 快速开始

### 前置要求
- Docker & Docker Compose
- 或者 Node.js 18+ + PostgreSQL 15

### 方式一：使用 Docker (推荐)

```bash
# 1. 克隆/进入项目目录
cd Project39

# 2. 给启动脚本添加执行权限
chmod +x start.sh

# 3. 启动所有服务
./start.sh
```

或者手动执行：

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 访问地址

启动成功后，访问以下地址：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端页面 | http://localhost:5173 | 健身计划管理系统 |
| 后端 API | http://localhost:3000/api | REST API 接口 |
| API 文档 | http://localhost:3000/api/docs | Swagger API 文档 |

## 📁 项目结构

```
Project39/
├── backend/                    # NestJS 后端
│   ├── src/
│   │   ├── app.module.ts      # 根模块
│   │   ├── main.ts             # 入口文件
│   │   ├── fitness-plan/       # 健身方案模块
│   │   ├── check-in/           # 打卡模块
│   │   └── statistics/         # 统计模块
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── App.tsx            # 主应用
│   │   ├── main.tsx           # 入口文件
│   │   ├── api/               # API 调用
│   │   └── pages/             # 页面组件
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Docker 编排
├── start.sh                    # 启动脚本
└── README.md
```

## 🔧 API 接口

### 健身方案
- `GET /api/fitness-plans` - 获取所有方案
- `GET /api/fitness-plans/:id` - 获取单个方案
- `POST /api/fitness-plans` - 创建方案
- `PATCH /api/fitness-plans/:id` - 更新方案
- `DELETE /api/fitness-plans/:id` - 删除方案

### 打卡记录
- `GET /api/check-ins` - 获取打卡记录（支持 date、startDate、endDate 参数）
- `GET /api/check-ins/:id` - 获取单个记录
- `POST /api/check-ins` - 创建打卡记录
- `DELETE /api/check-ins/:id` - 删除打卡记录

### 数据统计
- `GET /api/statistics/monthly?year=2024&month=5` - 获取月度统计

## 📝 使用说明

1. **创建健身方案**：进入"健身方案"页面，点击右上角按钮创建第一个健身计划
2. **每日打卡**：进入"每日打卡"页面，选择已创建的健身方案，填写完成情况
3. **查看统计**：进入"数据统计"页面，选择月份查看健身数据汇总和图表分析

## 🛑 停止服务

```bash
# 停止并删除容器
docker-compose down

# 停止并删除容器和数据卷（清空数据库）
docker-compose down -v
```

## 📄 许可证

MIT
