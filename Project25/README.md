# 办公文具批量采购管理平台

基于 Spring Boot + Vue 3 + Element Plus 的办公文具采购管理系统。

## 功能特性

- **品类管理**: 维护文具分类信息
- **文具清单**: 管理文具基本信息和库存
- **采购订单**: 创建采购订单，支持明细管理和审核
- **入库核验**: 采购入库，自动更新库存
- **部门管理**: 维护组织部门信息
- **部门申领**: 部门申领文具，自动扣减库存
- **申领统计**: 各部门申领数量统计

## 技术栈

### 后端
- Spring Boot 2.7.x
- MyBatis Plus 3.5.x
- MySQL 8.0
- Lombok

### 前端
- Vue 3
- Element Plus
- Vue Router
- Axios
- Vite

### 基础设施
- Docker & Docker Compose

## 快速开始

### 环境要求
- JDK 1.8+
- Node.js 16+
- Maven 3.6+
- Docker & Docker Compose

### 一键启动

```bash
# 方式1: 一键启动所有服务
./start.sh

# 方式2: 分步启动
# 1. 启动 MySQL
docker-compose up -d

# 2. 启动后端
cd backend
mvn clean package -DskipTests
java -jar target/stationery-purchase-1.0.0.jar

# 3. 启动前端 (新开终端)
cd frontend
npm install
npm run dev
```

### 访问地址

- 前端地址: http://localhost:3000
- 后端API: http://localhost:8080/api
- MySQL: localhost:3306 (用户名: stationery_user, 密码: stationery123)

### 停止服务

```bash
./stop.sh
```

## 项目结构

```
stationery-purchase/
├── backend/                 # Spring Boot 后端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/stationery/
│   │   │   │   ├── controller/    # 控制器
│   │   │   │   ├── service/       # 服务层
│   │   │   │   ├── mapper/        # 数据访问层
│   │   │   │   ├── entity/        # 实体类
│   │   │   │   └── common/        # 公共类
│   │   │   └── resources/
│   │   │       ├── application.yml  # 配置文件
│   │   │       └── sql/init.sql     # 初始化脚本
│   │   └── pom.xml
├── frontend/                # Vue 前端
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── router/          # 路由配置
│   │   ├── utils/           # 工具类
│   │   └── App.vue
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml       # Docker 配置
├── start.sh                 # 启动脚本
└── stop.sh                  # 停止脚本
```

## 数据库表说明

| 表名 | 说明 |
|------|------|
| category | 文具品类表 |
| purchase_item | 文具清单表 |
| purchase_order | 采购订单表 |
| purchase_order_detail | 采购订单明细表 |
| stock_in | 入库记录表 |
| department | 部门表 |
| claim_record | 申领记录表 |

## 业务流程

1. 维护文具品类信息
2. 维护文具清单信息
3. 创建采购订单（包含多个文具明细）
4. 审核采购订单
5. 采购入库，自动增加库存
6. 部门申领，自动扣减库存
7. 查看申领统计数据

## 默认数据

系统启动后自动初始化以下数据：

- **文具品类**: 书写工具、文件管理、纸品本册、办公辅助
- **部门**: 行政部、财务部、技术部、市场部、人事部
- **文具**: 中性笔、圆珠笔、文件夹、文件袋、A4打印纸、笔记本、订书机、计算器
