# 在线投票系统

基于 Java SpringBoot + Vue3 + Bootstrap + SQLite 开发的完整在线投票系统

## 技术栈

### 后端
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- SQLite 数据库
- Maven

### 前端
- Vue 3
- Vue Router
- Axios
- Bootstrap 5
- Bootstrap Icons
- Vite

## 核心功能

- ✅ 投票创建 - 支持设置标题、描述、多个选项、截止时间、是否多选
- ✅ 选项管理 - 动态添加、删除投票选项
- ✅ 在线投票 - 支持单选/多选模式
- ✅ 投票结果统计 - 实时展示票数和百分比进度条
- ✅ 投票历史查询 - 查看个人投票记录
- ✅ 防重复投票 - 基于用户标识防止重复投票
- ✅ 实时结果统计 - 投票后立即更新统计数据
- ✅ 投票截止控制 - 支持截止时间和手动关闭

## 项目结构

```
Project3/
├── backend/                 # 后端SpringBoot项目
│   ├── src/
│   │   └── main/
│   │       ├── java/com/voting/
│   │       │   ├── controller/    # 控制器
│   │       │   ├── service/       # 业务逻辑
│   │       │   ├── repository/    # 数据访问
│   │       │   ├── entity/        # 实体类
│   │       │   ├── dto/           # 数据传输对象
│   │       │   └── VotingApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                # 前端Vue3项目
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── router/          # 路由配置
│   │   ├── api/             # API接口
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── start.sh                 # 一键启动脚本
└── README.md
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- Node.js 16+
- npm 8+

### 一键启动（推荐）

```bash
# macOS/Linux
chmod +x start.sh
./start.sh
```

### 手动启动

#### 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

#### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:5173 启动

## API接口文档

### 投票相关接口

- `GET /api/polls` - 获取所有投票列表
- `GET /api/polls/active` - 获取进行中的投票列表
- `GET /api/polls/{id}` - 获取投票详情
- `POST /api/polls` - 创建新投票
- `POST /api/polls/{id}/vote` - 提交投票
- `PUT /api/polls/{id}/close` - 关闭投票
- `GET /api/polls/{id}/has-voted?voterId={voterId}` - 检查是否已投票
- `GET /api/polls/history?voterId={voterId}` - 获取投票历史

## 数据库

项目使用 SQLite 嵌入式数据库，无需额外安装配置。
数据库文件会自动创建在 `backend/voting.db`。

### 数据表

- `polls` - 投票主表
- `poll_options` - 投票选项表
- `vote_records` - 投票记录表

## 功能亮点

1. **防重复投票**：基于用户唯一标识（存储在localStorage），确保每个用户只能投票一次
2. **实时结果统计**：投票后立即更新结果展示，包含票数和百分比进度条
3. **投票截止控制**：支持设置截止时间，到期自动结束投票，也可手动关闭
4. **响应式设计**：使用Bootstrap 5，完美适配PC和移动端
5. **RESTful API**：标准的REST接口设计，易于扩展和对接

## 开发说明

### 后端开发

```bash
cd backend
# 编译
mvn clean compile
# 运行
mvn spring-boot:run
# 打包
mvn clean package
```

### 前端开发

```bash
cd frontend
# 安装依赖
npm install
# 开发模式（热重载）
npm run dev
# 构建生产版本
npm run build
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
