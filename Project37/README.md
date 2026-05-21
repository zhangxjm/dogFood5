# 企业内部文件传阅系统

基于 Spring Boot + Vue 3 开发的企业内部文件传阅管理系统。

## 功能特性

- ✅ **用户登录** - 支持多用户登录
- ✅ **文件上传** - 支持各种办公文件上传
- ✅ **文件传阅** - 指定人员进行文件传阅
- ✅ **阅读状态** - 实时查看文件阅读状态
- ✅ **文件下载** - 支持下载收到的文件
- ✅ **传阅记录** - 完整的传阅历史记录

## 技术栈

### 后端
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL 8.0
- Lombok

### 前端
- Vue 3
- Vue Router
- Element Plus
- Axios

### 中间件
- Docker & Docker Compose

## 快速启动

### 方式一：一键启动（推荐）

```bash
chmod +x start.sh
./start.sh
```

### 方式二：分步启动

#### 1. 启动 MySQL 数据库

```bash
docker-compose up -d mysql
```

#### 2. 启动后端服务

```bash
cd backend
mvn clean package -DskipTests
java -jar target/file-circulation-system-1.0.0.jar
```

#### 3. 启动前端服务

```bash
cd frontend
npm install
npm run serve
```

## 访问地址

- **前端页面**: http://localhost:3000
- **后端接口**: http://localhost:8080

## 测试账号

系统启动后会自动初始化以下测试用户：

| 用户名 | 密码 | 真实姓名 | 部门 |
|--------|------|----------|------|
| admin | 123456 | 管理员 | 行政部 |
| zhangsan | 123456 | 张三 | 技术部 |
| lisi | 123456 | 李四 | 财务部 |
| wangwu | 123456 | 王五 | 市场部 |

## 项目结构

```
.
├── backend/                 # 后端项目
│   ├── src/
│   │   └── main/
│   │       ├── java/com/filecirculation/
│   │       │   ├── entity/      # 实体类
│   │       │   ├── repository/  # 数据访问层
│   │       │   ├── service/     # 业务逻辑层
│   │       │   ├── controller/  # 控制器
│   │       │   └── config/      # 配置类
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── router/          # 路由配置
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   └── package.json
├── docker-compose.yml       # Docker 配置
├── start.sh                 # 一键启动脚本
└── README.md
```

## 核心 API 接口

### 用户相关
- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `GET /api/user/list` - 获取用户列表
- `GET /api/user/{id}` - 获取用户详情

### 文件相关
- `POST /api/file/upload` - 文件上传
- `GET /api/file/list` - 获取所有文件
- `GET /api/file/uploader/{uploaderId}` - 获取用户上传的文件
- `GET /api/file/{id}` - 获取文件详情
- `GET /api/file/download/{id}` - 下载文件

### 传阅相关
- `POST /api/circulation/circulate` - 发送传阅
- `GET /api/circulation/file/{fileId}` - 获取文件的传阅记录
- `GET /api/circulation/receiver/{receiverId}` - 获取收到的传阅
- `GET /api/circulation/circulator/{circulatorId}` - 获取发出的传阅
- `PUT /api/circulation/read/{id}` - 标记为已读

## 使用说明

1. **登录系统** - 使用测试账号登录
2. **上传文件** - 在"文件上传"页面上传办公文件
3. **发送传阅** - 在"文件传阅"页面选择文件和传阅人员
4. **查看收到的文件** - 在"收到的文件"页面查看他人发送的文件
5. **查看传阅状态** - 在"传阅状态"页面查看自己发出的传阅的阅读情况

## 环境要求

- JDK 17+
- Node.js 16+
- Docker & Docker Compose
- Maven 3.6+

## 注意事项

1. 首次启动会自动创建数据库表和初始化测试用户
2. 上传的文件保存在 `backend/uploads` 目录下
3. MySQL 数据通过 Docker Volume 持久化
4. 后端端口默认为 8080，前端端口默认为 3000
