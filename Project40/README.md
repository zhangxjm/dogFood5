# 五金小店商品台账管理系统

基于 Go Gin 框架开发的五金商品台账管理系统，支持商品登记、进货价格、售卖价格、库存管理以及缺货提醒功能。

## 功能特性

- 商品信息管理（增删改查）
- 进货价格、售卖价格记录
- 库存数量管理
- 库存缺货提醒
- RESTful API 接口

## 技术栈

- Go 1.x
- Gin Web 框架
- GORM ORM
- MySQL 8.0
- Docker

## 快速开始

### 1. 启动 MySQL 数据库

```bash
docker-compose up -d
```

### 2. 启动应用

```bash
go run main.go
```

服务器将在 `http://localhost:8080` 启动

## API 接口

### 健康检查

```bash
GET /health
```

### 商品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/products | 获取所有商品 |
| GET | /api/products/:id | 获取单个商品 |
| POST | /api/products | 创建商品 |
| PUT | /api/products/:id | 更新商品 |
| DELETE | /api/products/:id | 删除商品 |
| GET | /api/products/alert/low-stock | 库存缺货提醒 |

### 请求示例

#### 创建商品

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "螺丝刀",
    "category": "手动工具",
    "brand": "得力",
    "spec": "十字 PH2",
    "purchase_price": 5.50,
    "sale_price": 12.00,
    "stock": 50,
    "min_stock": 10,
    "unit": "把"
  }'
```

#### 查询库存不足商品

```bash
curl http://localhost:8080/api/products/alert/low-stock
```

## 数据库配置

默认数据库配置：
- 主机：localhost
- 端口：3306
- 数据库名：hardware_store
- 用户名：hardware
- 密码：hardware123

可通过环境变量自定义配置：
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

## 项目结构

```
.
├── main.go                 # 主程序入口
├── go.mod                  # Go 模块配置
├── docker-compose.yml      # Docker 配置
├── models/                 # 数据模型
│   └── product.go
├── controllers/            # 控制器
│   └── product_controller.go
├── database/               # 数据库连接
│   └── database.go
└── routes/                 # 路由配置
    └── routes.go
```
