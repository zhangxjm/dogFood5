# 河道周边环境巡查记录系统

基于 Go Fiber 框架开发的全栈河道周边环境巡查记录管理系统。

## 功能特性

- **巡查点位管理**：录入、编辑、删除巡查点位信息
- **巡查问题记录**：记录巡查发现的问题，包含问题类型、严重程度等
- **整改情况备注**：记录问题整改措施、责任人、整改状态
- **巡查台账汇总**：数据统计、图表展示、CSV导出

## 技术栈

- **后端**：Go + Fiber 框架
- **数据库**：SQLite（默认） / MySQL 8.0（可选）
- **ORM**：GORM
- **前端**：原生 HTML + CSS + JavaScript + ECharts
- **部署**：Docker + Docker Compose 或 本地直接运行

## 快速启动（推荐 - 无需 Docker）

### 方式一：本地直接运行（推荐，无需 Docker）

#### 环境要求
- Go 1.21 或更高版本

#### Windows 系统

双击运行 `run-local.bat` 或在命令行执行：

```batch
run-local.bat
```

#### Linux/Mac 系统

```bash
chmod +x run-local.sh
./run-local.sh
```

---

### 方式二：Docker 运行

#### 环境要求
- Docker
- Docker Compose

#### Windows 系统

```batch
start.bat
```

#### Linux/Mac 系统

```bash
chmod +x start.sh
./start.sh
```

> **注意**：如果 Docker 镜像拉取失败，可能是网络问题。可以：
> 1. 使用国内 Docker 镜像源
> 2. 或者使用上面的「本地直接运行」方式

---

### 访问系统

启动成功后，在浏览器访问：
```
http://localhost:8080
```

### 停止系统

**本地运行:**
- Windows: 在运行窗口按 `Ctrl+C`
- Linux/Mac: 在终端按 `Ctrl+C`

**Docker 方式:**

**Windows:**
```batch
stop.bat
```

**Linux/Mac:**
```bash
./stop.sh
```

## 数据库切换

系统默认使用 SQLite 数据库，无需额外安装。如需使用 MySQL，请修改 `backend/.env` 文件：

```
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inspection_db
```

## 项目结构

```
.
├── backend/                 # 后端代码
│   ├── main.go             # 应用入口
│   ├── app/
│   │   ├── controllers/    # 控制器层
│   │   ├── models/         # 数据模型
│   │   ├── services/       # 业务逻辑层
│   │   ├── routes/         # 路由定义
│   │   ├── middleware/     # 中间件
│   │   └── database/       # 数据库连接
│   └── config/             # 配置管理
├── frontend/               # 前端静态文件
│   ├── index.html
│   ├── css/
│   └── js/
├── docker/                 # Docker 配置
├── docker-compose.yml
├── start.bat / start.sh    # Docker 启动脚本
├── stop.bat / stop.sh      # Docker 停止脚本
├── run-local.bat           # Windows 本地运行脚本
└── run-local.sh            # Linux/Mac 本地运行脚本
```

## API 接口

### 巡查点位
- `GET /api/points` - 获取点位列表
- `POST /api/points` - 新增点位
- `PUT /api/points/:id` - 更新点位
- `DELETE /api/points/:id` - 删除点位

### 巡查记录
- `GET /api/records` - 获取记录列表
- `POST /api/records` - 新增记录
- `GET /api/records/:id` - 获取记录详情
- `DELETE /api/records/:id` - 删除记录

### 整改记录
- `GET /api/records/:recordId/rectifications` - 获取整改历史
- `POST /api/records/:recordId/rectifications` - 新增整改记录

### 统计台账
- `GET /api/stats/summary` - 总览统计
- `GET /api/stats/by-time` - 按时间统计
- `GET /api/stats/by-point` - 按点位统计
- `GET /api/stats/by-type` - 按问题类型统计
- `GET /api/stats/export` - 导出 CSV

## 初始化数据

系统启动时会自动初始化以下演示数据：
- 5 个巡查点位（长江、黄河、珠江、淮河、海河）
- 8 条巡查记录（不同问题类型、严重程度、整改状态）
- 5 条整改记录
