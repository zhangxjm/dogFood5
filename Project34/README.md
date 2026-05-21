# 乐谱共享平台

一个基于 Flask 的在线乐谱共享平台，支持乐谱上传、分类整理、在线预览和收藏功能。

## 功能特性

- **用户认证**：用户注册、登录、登出
- **乐谱上传**：支持 PDF、PNG、JPG、GIF 格式
- **分类管理**：钢琴、吉他、小提琴、声乐、合奏、其他
- **在线预览**：图片和 PDF 在线预览
- **收藏功能**：收藏喜欢的乐谱
- **我的乐谱**：管理自己上传的乐谱
- **搜索功能**：按标题搜索乐谱

## 技术栈

- **后端框架**：Flask 3.0.0
- **数据库**：PostgreSQL 15
- **ORM**：Flask-SQLAlchemy
- **用户认证**：Flask-Login
- **前端**：Bootstrap 5 + Bootstrap Icons
- **容器化**：Docker + Docker Compose

## 快速开始

### 使用 Docker 启动（推荐）

1. 确保已安装 Docker 和 Docker Compose

2. 在项目根目录执行：
```bash
docker-compose up -d
```

3. 访问应用：http://localhost:5000

4. 停止服务：
```bash
docker-compose down
```

### 本地开发启动

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 创建 `.env` 文件（已提供）：
```env
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=sqlite:///sheetmusic.db
FLASK_APP=app.py
FLASK_ENV=development
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

3. 启动应用：
```bash
python app.py
```

4. 访问应用：http://localhost:5000

## 项目结构

```
Project34/
├── app.py                 # Flask 主应用
├── init_db.py             # 数据库初始化脚本
├── requirements.txt       # Python 依赖
├── Dockerfile            # Docker 镜像配置
├── docker-compose.yml    # Docker Compose 配置
├── start.sh              # 启动脚本
├── .env                  # 环境变量
├── uploads/              # 上传文件目录
├── templates/            # HTML 模板
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── upload.html
│   ├── sheet_detail.html
│   ├── favorites.html
│   └── my_sheets.html
└── static/
    └── css/
        └── style.css
```

## 使用说明

1. **注册账号**：点击右上角"注册"，填写用户名、邮箱、密码
2. **登录**：使用注册的账号登录
3. **上传乐谱**：点击导航栏"上传乐谱"，填写标题、描述，选择分类，上传文件
4. **浏览乐谱**：在首页按分类浏览，或使用搜索功能
5. **查看详情**：点击乐谱卡片查看详细信息和在线预览
6. **收藏乐谱**：在详情页点击"收藏"按钮
7. **管理我的乐谱**：在"我的乐谱"页面查看和删除自己上传的乐谱

## 环境变量说明

- `SECRET_KEY`：Flask 密钥，生产环境请修改为随机字符串
- `DATABASE_URL`：数据库连接地址
- `FLASK_ENV`：运行环境（development/production）
- `UPLOAD_FOLDER`：上传文件存储目录
- `MAX_CONTENT_LENGTH`：最大上传文件大小（字节）

## 默认分类

系统默认创建以下乐谱分类：
- 钢琴
- 吉他
- 小提琴
- 声乐
- 合奏
- 其他
