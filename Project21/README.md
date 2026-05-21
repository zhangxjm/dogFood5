# 企业饮用水管理系统

基于 Spring Boot + Vue 3 的企业桶装水申领管理系统。

## 技术栈

### 后端
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL 8.0
- Lombok

### 前端
- Vue 3.4
- Vite 5
- Element Plus
- ECharts 5
- Vue Router 4
- Axios

## 功能模块

1. **首页概览** - 实时库存、本月消耗、统计卡片
2. **库存管理** - 入库登记、库存查询、操作记录
3. **申领登记** - 员工申领、申领记录查询
4. **统计报表** - 月度趋势、部门排行

## 快速启动

### 方式一：一键启动（推荐）

```bash
./start.sh
```

### 方式二：分步启动

#### 1. 启动数据库
```bash
docker-compose up -d mysql
```

#### 2. 启动后端
```bash
cd backend
mvn spring-boot:run
```

#### 3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 访问地址

- 前端: http://localhost:5173
- 后端: http://localhost:8080
- 数据库: localhost:3306/water_db
  - 用户名: root
  - 密码: 123456

## 项目结构

```
.
├── backend/                    # 后端项目
│   ├── src/main/java/com/water/
│   │   ├── controller/        # 控制器层
│   │   ├── service/           # 服务层
│   │   ├── repository/        # 数据访问层
│   │   ├── entity/            # 实体类
│   │   ├── dto/               # 数据传输对象
│   │   ├── config/            # 配置类
│   │   └── WaterManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── views/             # 页面组件
│   │   ├── api/               # API 接口
│   │   ├── router/            # 路由配置
│   │   ├── utils/             # 工具类
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml          # Docker 配置
└── start.sh                    # 一键启动脚本
```

## API 接口

### 库存管理
- `GET /api/inventory` - 获取库存信息
- `POST /api/inventory/stock-in` - 库存入库
- `GET /api/inventory/operations` - 操作记录

### 申领管理
- `POST /api/claims` - 创建申领
- `GET /api/claims` - 获取所有申领
- `GET /api/claims/monthly?year=&month=` - 月度申领
- `GET /api/claims/statistics/monthly?year=` - 月度统计
- `GET /api/claims/statistics/department?year=&month=` - 部门统计
- `GET /api/claims/statistics/monthly-consumption` - 本月消耗