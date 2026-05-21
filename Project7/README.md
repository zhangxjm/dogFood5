# 项目任务管理系统

基于 Java SpringBoot + Vue3 + Element Plus + SQLite 开发的项目任务管理系统。

## 功能特性

- ✅ 用户认证与授权（JWT）
- ✅ 项目创建与管理
- ✅ 任务分配与跟踪
- ✅ 任务状态更新
- ✅ 任务进度可视化
- ✅ 项目统计分析
- ✅ 成员权限管理
- ✅ 项目甘特图

## 技术栈

### 后端
- Java 17
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- SQLite
- JWT

### 前端
- Vue 3
- Vue Router
- Pinia
- Element Plus
- Axios
- Chart.js

## 快速开始

### 方式一：使用 Docker Compose（推荐）

```bash
# 克隆项目后直接启动
docker-compose up -d

# 访问
# 前端：http://localhost
# 后端：http://localhost:8080
```

### 方式二：本地开发运行

#### 启动后端
```bash
cd backend
mvn spring-boot:run
```

#### 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
.
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskmanager/
│   │   │   │   ├── entity/      # 实体类
│   │   │   │   ├── dto/         # 数据传输对象
│   │   │   │   ├── repository/  # 数据访问层
│   │   │   │   ├── service/     # 业务逻辑层
│   │   │   │   ├── controller/  # 控制器
│   │   │   │   └── config/      # 配置类
│   │   │   └── resources/
│   │   └── pom.xml
│   └── Dockerfile
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── stores/          # 状态管理
│   │   ├── router/          # 路由配置
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 项目
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情
- `POST /api/projects` - 创建项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目
- `GET /api/projects/:id/statistics` - 获取项目统计

### 任务
- `GET /api/tasks` - 获取所有任务
- `GET /api/tasks/project/:projectId` - 获取项目任务
- `GET /api/tasks/my-tasks` - 获取我的任务
- `POST /api/tasks/project/:projectId` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `PATCH /api/tasks/:id/progress` - 更新进度
- `PATCH /api/tasks/:id/status` - 更新状态
- `DELETE /api/tasks/:id` - 删除任务

### 成员
- `GET /api/projects/:id/members` - 获取项目成员
- `POST /api/projects/:id/members` - 添加成员
- `PUT /api/projects/:id/members/:userId` - 更新角色
- `DELETE /api/projects/:id/members/:userId` - 移除成员

## 默认账号

系统启动时会自动创建默认管理员账号：

- **用户名**: `admin`
- **密码**: `admin123`

首次注册的用户将拥有完整权限。

## 许可证

MIT
