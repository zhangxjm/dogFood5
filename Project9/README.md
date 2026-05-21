# 社区生鲜食材后台管理系统

基于 Spring Boot + Vue 3 + MySQL 的社区生鲜食材后台管理系统。

## 功能特性

- 食材分类管理
- 商品管理
- 库存管理
- 供应商管理
- 供货记录管理
- 滞销商品统计
- 权限控制

## 技术栈

### 后端
- Java 8
- Spring Boot 2.7.14
- MyBatis Plus 3.5.3.1
- MySQL 8.0

### 前端
- Vue 3.3.4
- Vue Router 4.2.4
- Pinia 2.1.6
- Element Plus 2.3.14
- Axios 1.5.0
- Vite 4.4.9

## 快速启动

### 前置要求
- Docker & Docker Compose
- JDK 8+
- Maven 3.6+
- Node.js 16+

### 一键启动

#### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

#### Windows
```bash
start.bat
```

### 手动启动

#### 1. 启动 MySQL
```bash
docker-compose up -d
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

- 前端: http://localhost:3000
- 后端: http://localhost:8080

## 默认账号

- 用户名: admin
- 密码: admin123

## 数据库配置

- 数据库名: fresh_food
- 用户名: root
- 密码: 123456
- 端口: 3306

## 项目结构

```
.
├── backend                 # 后端项目
│   ├── src
│   │   └── main
│   │       ├── java/com/freshfood
│   │       │   ├── config     # 配置类
│   │       │   ├── controller # 控制器
│   │       │   ├── entity     # 实体类
│   │       │   ├── mapper     # Mapper接口
│   │       │   ├── service    # 服务层
│   │       │   └── util       # 工具类
│   │       └── resources
│   │           └── application.yml
│   └── pom.xml
├── frontend                # 前端项目
│   ├── src
│   │   ├── components     # 组件
│   │   ├── router         # 路由配置
│   │   ├── stores         # 状态管理
│   │   ├── utils          # 工具函数
│   │   ├── views          # 页面
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml     # Docker配置
├── start.sh              # Mac/Linux启动脚本
├── start.bat             # Windows启动脚本
└── README.md
```
