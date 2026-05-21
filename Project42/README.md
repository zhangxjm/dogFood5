# 硬笔书法打卡系统

一个功能完整的硬笔书法打卡系统，基于 FastAPI 构建，支持发布任务、上传作品、统计打卡、优秀作品展示等功能。

## 功能特性

- 🔐 **用户认证系统**: JWT 认证，支持注册、登录
- 📝 **打卡任务管理**: 管理员可发布每日/每周练习任务
- 📸 **作品上传**: 用户可上传书法作品图片
- 📊 **打卡统计**: 每日/每月打卡统计，连续打卡天数
- 🌟 **优秀作品展示**: 精选优秀作品公开展示
- ❤️ **点赞功能**: 用户可互相点赞作品
- 🏆 **排行榜**: 根据打卡次数进行排名

## 技术栈

- **后端框架**: FastAPI 0.109.0
- **数据库**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT (python-jose)
- **密码加密**: passlib + bcrypt
- **文件处理**: Pillow
- **容器化**: Docker + Docker Compose

## 快速开始

### 方式一：使用 Docker Compose（推荐）

```bash
# 克隆项目
cd Project42

# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f web

# 初始化数据库（创建管理员和示例数据）
docker-compose exec web python init_db.py
```

服务启动后访问：
- API 文档: http://localhost:8000/docs
- ReDoc 文档: http://localhost:8000/redoc

### 方式二：本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 确保 PostgreSQL 已启动并配置好 .env 文件

# 初始化数据库
python init_db.py

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 默认账号

| 角色   | 用户名 | 密码     | 权限       |
|--------|--------|----------|------------|
| 管理员 | admin  | admin123 | 所有权限   |
| 演示用户 | demo  | demo123 | 普通用户权限 |

## API 接口说明

### 认证模块 (`/auth`)
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录（获取 Token）

### 用户模块 (`/users`)
- `GET /users/me` - 获取当前用户信息
- `GET /users/me/stats` - 获取当前用户统计数据
- `GET /users/ranking/list` - 获取打卡排行榜

### 任务模块 (`/tasks`)
- `GET /tasks/` - 获取任务列表
- `GET /tasks/today` - 获取今日任务
- `POST /tasks/` - 创建任务（管理员）
- `PUT /tasks/{id}` - 更新任务（管理员）
- `DELETE /tasks/{id}` - 删除任务（管理员）

### 作品提交模块 (`/submissions`)
- `GET /submissions/` - 获取作品列表
- `GET /submissions/me` - 获取我的作品
- `POST /submissions/` - 提交作品（上传图片）
- `POST /submissions/{id}/like` - 点赞作品
- `DELETE /submissions/{id}/like` - 取消点赞
- `POST /submissions/{id}/excellent` - 标记为优秀（管理员）

### 展示模块 (`/showcase`)
- `GET /showcase/excellent` - 获取优秀作品列表

### 统计模块 (`/stats`)
- `GET /stats/daily` - 获取每日打卡统计
- `GET /stats/monthly` - 获取每月打卡统计

## 项目结构

```
Project42/
├── app/
│   ├── __init__.py
│   ├── main.py              # 主应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库连接
│   ├── models.py            # 数据库模型
│   ├── schemas.py           # Pydantic 数据模型
│   ├── crud.py              # CRUD 操作
│   ├── security.py          # 安全认证
│   └── routers/             # 路由模块
│       ├── __init__.py
│       ├── auth.py          # 认证路由
│       ├── users.py         # 用户路由
│       ├── tasks.py         # 任务路由
│       ├── submissions.py   # 作品提交路由
│       ├── showcase.py      # 展示路由
│       └── stats.py         # 统计路由
├── uploads/                 # 上传文件目录
├── docker-compose.yml       # Docker Compose 配置
├── Dockerfile               # Docker 镜像配置
├── requirements.txt         # Python 依赖
├── .env                     # 环境变量
├── init_db.py               # 数据库初始化脚本
└── README.md                # 项目说明
```

## 环境变量配置

在 `.env` 文件中可配置以下参数：

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/calligraphy_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
```

## 使用示例

### 1. 注册新用户

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "nickname": "新用户"
  }'
```

### 2. 登录获取 Token

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### 3. 创建打卡任务（管理员）

```bash
curl -X POST "http://localhost:8000/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "竖画练习",
    "description": "练习基本竖画的写法",
    "content": "练习竖画10遍，保持垂直和力度",
    "start_date": "2024-01-15",
    "end_date": "2024-01-22"
  }'
```

### 4. 上传作品打卡

```bash
curl -X POST "http://localhost:8000/submissions/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "task_id=1" \
  -F "description=今日练习完成" \
  -F "file=@/path/to/calligraphy.jpg"
```

## 注意事项

1. 生产环境请务必修改 `SECRET_KEY`
2. 建议配置 HTTPS
3. 定期备份数据库和上传文件
4. 可根据需要调整文件大小限制 `MAX_UPLOAD_SIZE`

## 许可证

MIT License
