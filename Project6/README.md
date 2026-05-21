# 农产品销售系统（农户版）

基于 Go Gin + Vue3 + Element Plus + MySQL 构建的农产品销售管理系统。

## 技术栈

- **后端**: Go 1.21 + Gin + GORM
- **前端**: Vue 3 + Element Plus + ECharts
- **数据库**: MySQL 8.0
- **容器化**: Docker + Docker Compose

## 核心功能

### 1. 数据统计仪表盘
- 总订单数、总收入、商品总数、客户总数统计
- 今日订单、今日收入、待处理订单实时数据
- 热销商品排行榜
- 销售额趋势图（ECharts）
- 分类销售占比饼图

### 2. 农产品管理
- 农产品发布、编辑、删除
- 商品分类管理
- 库存、价格、单位设置
- 商品状态管理（在售/下架）

### 3. 订单管理
- 订单列表查看和筛选
- 订单详情查看（含商品明细）
- 订单状态流转：
  - 待处理 → 已确认 → 已发货 → 已完成
  - 支持取消订单
- 状态变更日志记录

### 4. 客户管理
- 客户信息增删改查
- 客户消费统计（订单数、总金额）
- 客户地址、联系方式管理

## 快速开始

### 启动系统

```bash
# 首次启动需要先本地编译Go应用（解决Docker网络问题）
cd backend
CGO_ENABLED=0 GOOS=linux go build -o main .
cd ..

# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 访问地址

- **前端页面**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **数据库**: localhost:3306
  - 用户名: root
  - 密码: root123456
  - 数据库: farm_sales

### 停止系统

```bash
docker compose down

# 停止并删除数据（谨慎使用）
docker compose down -v
```

## 项目结构

```
.
├── backend/                 # Go后端项目
│   ├── main.go             # 主入口文件
│   ├── models/             # 数据模型
│   ├── handlers/           # API处理器
│   ├── database/           # 数据库连接
│   ├── config/             # 配置文件
│   ├── init.sql            # 数据库初始化脚本
│   ├── go.mod
│   ├── go.sum
│   ├── main                # 编译后的二进制文件
│   └── Dockerfile
├── frontend/               # Vue前端项目
│   ├── src/
│   │   ├── main.js         # 入口文件
│   │   ├── App.vue         # 根组件
│   │   ├── router/         # 路由配置
│   │   ├── api/            # API封装
│   │   └── views/          # 页面组件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml      # Docker编排文件
└── README.md
```

## API接口列表

### 产品相关
- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取产品详情
- `POST /api/products` - 创建产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品
- `GET /api/products/categories` - 获取产品分类列表

### 客户相关
- `GET /api/customers` - 获取客户列表
- `GET /api/customers/:id` - 获取客户详情
- `POST /api/customers` - 创建客户
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户
- `GET /api/customers/:id/orders` - 获取客户订单

### 订单相关
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id/status` - 更新订单状态
- `GET /api/orders/statuses` - 获取订单状态列表
- `GET /api/orders/:id/logs` - 获取订单状态变更日志

### 统计相关
- `GET /api/statistics/dashboard` - 获取仪表盘统计数据
- `GET /api/statistics/sales-by-category` - 按分类销售额统计
- `GET /api/statistics/sales-by-date` - 按日期销售额统计
- `GET /api/statistics/top-products` - 热销商品统计

## 开发说明

### 后端开发

```bash
cd backend
go mod tidy
go run main.go
```

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

## 数据库表结构

- `products` - 农产品表
- `customers` - 客户表
- `orders` - 订单表
- `order_items` - 订单明细表
- `order_status_logs` - 订单状态变更日志表

## 订单状态流转

```
待处理(pending) → 已确认(confirmed) → 已发货(shipped) → 已完成(completed)
                        ↓
                  已取消(cancelled)
```

## 注意事项

1. 首次启动时，Docker会自动执行 `init.sql` 初始化数据库并导入示例数据
2. 如需重新初始化数据库，删除 mysql 数据卷后重启：
   ```bash
   docker compose down -v
   docker compose up -d
   ```
3. 后端 Go 代码修改后需要重新编译：
   ```bash
   cd backend
   CGO_ENABLED=0 GOOS=linux go build -o main .
   docker compose up -d --build backend
   ```
