# 生鲜果蔬采摘园预约入园小程序

基于 SpringBoot + Uniapp 开发的完整预约系统

## 功能特性

- ✅ 入园时段管理
- ✅ 游客在线预约
- ✅ 入园核销功能
- ✅ 采摘品类介绍
- ✅ 预约记录查询

## 技术栈

### 后端
- SpringBoot 2.7.x
- MyBatis-Plus
- MySQL 8.0
- Redis

### 前端
- Uniapp
- Vue 2.x
- 支持微信小程序/H5/App

## 快速启动

### 前置要求
- Docker & Docker Compose
- JDK 1.8+
- Maven 3.x
- HBuilderX（运行小程序）

### 启动步骤

1. **一键启动（推荐）**
```bash
chmod +x start.sh
./start.sh
```

2. **手动启动**

启动数据库和Redis：
```bash
docker-compose up -d
```

启动后端：
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

运行前端：
- 使用 HBuilderX 打开 `frontend` 目录
- 选择运行到微信小程序或H5

## API 接口

### 时段管理
- `GET /api/time-slot/list` - 获取时段列表
- `POST /api/time-slot` - 创建时段

### 预约管理
- `POST /api/reservation` - 创建预约
- `POST /api/reservation/checkin/{reservationNo}` - 核销预约
- `GET /api/reservation/list/{phone}` - 查询预约列表

### 品类管理
- `GET /api/category/list` - 获取品类列表
- `POST /api/category` - 创建品类

## 项目结构

```
Project41/
├── backend/                    # SpringBoot 后端
│   ├── src/main/java/com/orchard/
│   │   ├── entity/            # 实体类
│   │   ├── mapper/            # 数据访问层
│   │   ├── service/           # 服务层
│   │   ├── controller/        # 控制器
│   │   ├── config/            # 配置类
│   │   └── OrchardApplication.java
│   └── src/main/resources/
│       ├── application.yml    # 配置文件
│       └── sql/init.sql       # 初始化脚本
├── frontend/                   # Uniapp 前端
│   ├── pages/                  # 页面
│   │   ├── index/             # 首页
│   │   ├── reservation/       # 预约页
│   │   ├── category/          # 品类页
│   │   ├── checkin/           # 核销页
│   │   └── my/                # 我的预约
│   ├── utils/request.js        # 请求工具
│   ├── static/                 # 静态资源
│   ├── App.vue
│   ├── main.js
│   ├── pages.json
│   └── manifest.json
├── docker-compose.yml           # Docker 编排
└── start.sh                    # 启动脚本
```

## 数据库初始化

系统启动时会自动执行 `backend/src/main/resources/sql/init.sql`，包含：
- 建表语句（时段表、预约表、品类表）
- 初始测试数据（6个采摘品类、4个默认时段）

## 注意事项

1. 确保 Docker 已启动，端口 3306、6379、8080 未被占用
2. 微信小程序运行需要配置合法域名或开启"不校验合法域名"
3. 前端默认请求地址为 `http://localhost:8080/api`，如需修改请编辑 `frontend/utils/request.js`

## License

MIT
