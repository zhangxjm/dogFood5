# 零食批发进销存系统

基于 Node.js Koa + Vue3 + MySQL 开发的零食批发进销存管理系统。

## 功能特性

- **供货商管理**：供货商信息的增删改查
- **货品管理**：货品信息的增删改查，支持关联供货商
- **库存管理**：
  - 库存余量查询
  - 货品入库/出库
  - 出入库记录
- **订单管理**：
  - 批发订单登记
  - 订单完成/取消
  - 订单详情查看

## 技术栈

- **后端**：Node.js + Koa2 + Sequelize(ORM)
- **前端**：Vue3 + Element Plus + Vue Router + Axios
- **数据库**：MySQL 8.0
- **容器化**：Docker + Docker Compose

## 快速启动

### 方式一：使用启动脚本（推荐）

```bash
./start.sh
```

### 方式二：手动启动

```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

## 访问地址

- **前端界面**：http://localhost:5173
- **后端API**：http://localhost:3000
- **MySQL数据库**：localhost:3307 (用户名: root, 密码: 123456)

## 项目结构

```
.
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   └── app.js          # 入口文件
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── views/          # 页面
│   │   ├── router/         # 路由
│   │   ├── api/            # API封装
│   │   └── main.js         # 入口文件
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
├── docker compose.yml      # Docker编排配置
├── start.sh               # 启动脚本
└── README.md
```

## 初始化数据

系统启动后会自动创建以下初始数据：

### 供货商

1. 好丽友食品有限公司
2. 乐事（中国）有限公司
3. 旺旺集团

### 货品

- 好丽友派、呀！土豆、乐事薯片、旺旺雪饼、QQ糖等

### 库存

每种货品初始库存 100 件

## 常用命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看后端日志
docker compose logs -f backend

# 查看前端日志
docker compose logs -f frontend

# 查看数据库日志
docker compose logs -f mysql

# 重新构建
docker compose build --no-cache
```

## 开发说明

### 后端开发

- API 基础路径：`http://localhost:3000/api`
- 使用 Sequelize ORM 操作数据库
- 支持自动建表和数据初始化

### 前端开发

- 使用 Vue3 Composition API
- Element Plus UI 组件库
- Vite 构建工具，支持热重载

## 注意事项

1. 确保已安装 Docker 和 Docker Compose
2. 端口 3000、5173、3307 未被占用
3. 首次启动需要下载依赖和构建镜像，可能需要几分钟时间
4. MySQL 数据会持久化保存在 Docker Volume 中
