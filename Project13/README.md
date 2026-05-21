# 茶饮门店订单管理系统

基于 SpringBoot + Vue3 + Vant 的移动端茶饮门店订单管理系统

## 技术栈

### 后端
- Spring Boot 2.7.18
- Spring Data JPA
- MySQL 8.0
- Redis 7
- Lombok

### 前端
- Vue 3.3.4
- Vant 4.6.6
- Vue Router 4
- Axios
- Vite

## 功能特性

1. **饮品套餐设置**
   - 饮品的增删改查
   - 饮品分类管理（奶茶、果茶、特调、套餐）
   - 上架/下架状态管理

2. **顾客下单**
   - 按分类浏览饮品
   - 购物车功能
   - 订单提交

3. **门店出餐状态更新**
   - 订单列表展示
   - 按状态筛选（待制作、制作中、已完成、已取消）
   - 订单状态流转

4. **单日营业汇总**
   - 按日期查询营业数据
   - 总订单数、总营业额统计
   - 客单价计算
   - 当日订单明细

## 快速启动

### 前置条件
- Docker & Docker Compose
- JDK 1.8+
- Node.js 16+
- Maven 3.6+

### 启动步骤

#### 1. 启动中间件（MySQL + Redis）

```bash
docker-compose up -d
```

MySQL 信息：
- 端口：3306
- 数据库：tea_shop
- 用户名：tea_shop
- 密码：tea_shop123

Redis 信息：
- 端口：6379

#### 2. 启动后端

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

后端服务地址：http://localhost:8080/api

#### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端访问地址：http://localhost:3000

## API 接口文档

### 饮品接口
- `GET /api/drinks` - 获取所有饮品
- `GET /api/drinks/available` - 获取可用饮品
- `GET /api/drinks/category/{category}` - 按分类获取饮品
- `GET /api/drinks/{id}` - 获取饮品详情
- `POST /api/drinks` - 创建饮品
- `PUT /api/drinks/{id}` - 更新饮品
- `DELETE /api/drinks/{id}` - 删除饮品

### 订单接口
- `GET /api/orders` - 获取所有订单
- `GET /api/orders/status/{status}` - 按状态获取订单
- `GET /api/orders/{id}` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/{id}/status?status={status}` - 更新订单状态
- `GET /api/orders/summary/daily?date={date}` - 获取单日汇总

## 订单状态说明

- 0: 已取消
- 1: 待制作
- 2: 制作中
- 3: 已完成

## 项目结构

```
.
├── backend                 # 后端项目
│   ├── src
│   │   └── main
│   │       ├── java/com/teashop
│   │       │   ├── common      # 公共类
│   │       │   ├── config      # 配置类
│   │       │   ├── controller  # 控制器
│   │       │   ├── dto         # 数据传输对象
│   │       │   ├── entity      # 实体类
│   │       │   ├── repository  # 数据访问层
│   │       │   └── service     # 业务逻辑层
│   │       └── resources
│   │           └── application.yml
│   ├── sql                 # 初始化SQL
│   └── pom.xml
├── frontend                # 前端项目
│   ├── src
│   │   ├── api             # API封装
│   │   ├── router          # 路由配置
│   │   ├── views           # 页面组件
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```
