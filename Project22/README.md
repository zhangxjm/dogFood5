# 自习室座位预约管理系统

基于 FastAPI + Ant Design 的自习室座位预约管理后台，支持区域管理、座位预约、超时自动释放等功能。

## 🚀 快速启动

### 方式一：Docker 一键启动（推荐）

```bash
# 给启动脚本添加执行权限
chmod +x start.sh

# 一键启动
./start.sh
```

### 方式二：Docker Compose 手动启动

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🌐 访问地址

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## ✨ 功能特性

### 📚 区域管理
- 创建、编辑、删除自习区域
- 启用/禁用区域
- 区域描述管理

### 💺 座位管理
- 座位网格布局展示
- 座位属性（电源、靠窗等）
- 按区域筛选座位
- 实时座位状态

### 📅 预约管理
- 按时段选择座位预约
- 预约签到功能
- 预约取消功能
- 15分钟超时自动释放
- 预约状态实时展示

### 👥 用户管理
- 用户信息管理
- 预约记录关联

## 🛠️ 技术栈

### 后端
- **FastAPI**: 现代化 Python Web 框架
- **SQLAlchemy**: ORM 数据库工具
- **PostgreSQL**: 关系型数据库
- **Redis**: 缓存和会话存储
- **APScheduler**: 定时任务调度

### 前端
- **React 18**: 用户界面库
- **Ant Design 5**: 企业级 UI 组件库
- **React Router**: 路由管理
- **Axios**: HTTP 客户端
- **Day.js**: 日期时间处理

## 📁 项目结构

```
Project22/
├── backend/                 # 后端服务
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI 主入口
│   │   ├── database.py     # 数据库配置
│   │   ├── models.py       # 数据模型
│   │   ├── schemas.py      # Pydantic 模式
│   │   ├── crud.py         # CRUD 操作
│   │   └── scheduler.py    # 定时任务
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
├── frontend/               # 前端服务
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── Dashboard.js
│   │   │   ├── AreaManagement.js
│   │   │   ├── SeatManagement.js
│   │   │   ├── ReservationManagement.js
│   │   │   └── UserManagement.js
│   │   ├── services/
│   │   │   └── api.js     # API 服务
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── start.sh
└── README.md
```

## 📊 初始化数据

系统启动时会自动创建以下初始数据：

### 用户
- admin / admin@example.com (管理员)
- user1 / user1@example.com (用户1)

### 区域
- 一楼自习区 (20个座位)
- 二楼讨论区 (15个座位)

## ⏰ 定时任务

- **预约超时检查**: 每分钟执行一次
- **超时释放规则**: 预约开始后15分钟未签到自动释放

## 🐳 Docker 服务

- **PostgreSQL**: 数据库服务 (端口 5432)
- **Redis**: 缓存服务 (端口 6379)
- **Backend**: FastAPI 后端 (端口 8000)
- **Frontend**: React 前端 (端口 3000)

## 🔧 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# 重启服务
docker-compose restart

# 重新构建
docker-compose build --no-cache
```

## 📝 API 接口

主要 API 端点：

- `GET /api/areas` - 获取区域列表
- `POST /api/areas` - 创建区域
- `GET /api/seats` - 获取座位列表
- `GET /api/seats/with-status` - 带状态的座位列表
- `GET /api/seats/{id}/time-slots` - 座位时间段
- `GET /api/reservations` - 获取预约列表
- `POST /api/reservations` - 创建预约
- `POST /api/reservations/{id}/cancel` - 取消预约
- `POST /api/reservations/{id}/check-in` - 签到

完整 API 文档请访问: http://localhost:8000/docs
