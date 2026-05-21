# 母婴实体店会员信息管理系统

基于 SpringBoot + Vue3 的母婴实体店会员信息管理系统，支持会员管理、消费记录、会员等级划分和福利领取记录。

## ✨ 功能特性

- 👥 **会员管理**: 会员信息录入、编辑、删除、搜索
- 📊 **消费记录**: 消费记录管理，自动计算积分
- 🏆 **会员等级**: 根据积分自动划分会员等级
- 🎁 **福利管理**: 福利商品管理，积分兑换
- 📱 **响应式界面**: 基于 Element Plus 的现代化界面

## 🛠 技术栈

### 后端
- SpringBoot 3.2.0
- Spring Data JPA
- MySQL 8.0
- Lombok

### 前端
- Vue 3
- Vue Router
- Axios
- Element Plus
- Vite

## 🚀 快速开始

### 环境要求
- Docker & Docker Compose
- 或 JDK 17 + Node.js 18 + MySQL 8.0

### 方式一：Docker 一键启动（推荐）

```bash
# 1. 进入项目目录
cd Project33

# 2. 给启动脚本添加执行权限
chmod +x start.sh stop.sh

# 3. 一键启动所有服务
./start.sh
```

启动完成后访问：
- 前端: http://localhost:3000
- 后端API: http://localhost:8080

停止服务：
```bash
./stop.sh
```

### 方式二：本地开发启动

#### 启动后端
```bash
cd backend

# 配置 MySQL 连接信息（修改 application.yml）
# 确保本地 MySQL 已启动并创建数据库 babycare_member

# 启动后端
mvn spring-boot:run
```

#### 启动前端
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
Project33/
├── backend/                    # 后端项目
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/babycare/member/
│   │       │       ├── entity/          # 实体类
│   │       │       ├── repository/      # 数据访问层
│   │       │       ├── service/         # 业务逻辑层
│   │       │       └── controller/      # 控制层
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   ├── router/             # 路由配置
│   │   ├── api/                # API 调用
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── start.sh
└── stop.sh
```

## 🗄 数据库配置

- 数据库名: `babycare_member`
- 用户名: `root`
- 密码: `123456`
- 端口: `3306`

## 📝 API 接口

| 模块 | 接口前缀 | 说明 |
|------|---------|------|
| 会员 | /api/members | 会员CRUD操作 |
| 会员等级 | /api/member-levels | 会员等级管理 |
| 消费记录 | /api/consumption-records | 消费记录管理 |
| 福利 | /api/benefits | 福利商品管理 |
| 福利领取 | /api/benefit-claims | 福利领取记录 |

## 🔧 常用命令

### Docker 相关
```bash
# 查看服务状态
docker compose ps

# 查看后端日志
docker logs -f babycare-backend

# 查看前端日志
docker logs -f babycare-frontend

# 查看数据库日志
docker logs -f babycare-mysql

# 进入数据库
docker exec -it babycare-mysql mysql -uroot -p123456
```

### 后端开发
```bash
# 编译项目
mvn clean package

# 运行测试
mvn test
```

### 前端开发
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

## 📋 使用说明

1. **添加会员等级**: 先进入"会员等级"页面，配置不同积分对应的会员等级
2. **添加会员**: 进入"会员管理"页面，录入会员基本信息
3. **添加消费记录**: 会员消费时，在"消费记录"页面添加消费，系统自动计算积分
4. **添加福利**: 在"福利管理"页面添加可兑换的福利商品
5. **福利兑换**: 会员使用积分兑换福利时，在"福利领取"页面操作

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License