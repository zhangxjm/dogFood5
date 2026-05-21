# 书画作品展示平台

基于 Flask + Vue3 开发的线上书画作品展示平台，支持作品上传分类、作品简介编辑、访客浏览点赞等功能。

## 技术栈

### 后端
- **Python 3.11**
- **Flask 3.0** - Web 框架
- **Flask-SQLAlchemy** - ORM 数据库
- **Flask-CORS** - 跨域支持
- **Redis** - 缓存（用于点赞限流）
- **Pillow** - 图片处理

### 前端
- **Vue 3.4** - 渐进式框架
- **Vue Router 4** - 路由管理
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **Vite** - 构建工具

### 中间件
- **Docker & Docker Compose** - 容器化部署

## 功能特性

✅ **作品管理**
- 作品图片上传（支持 JPG、PNG、GIF 等格式）
- 作品标题、作者、简介编辑
- 图片自动压缩优化

✅ **分类管理**
- 书法、国画、油画、水彩、素描等预设分类
- 分类筛选浏览

✅ **浏览互动**
- 作品列表分页展示
- 作品详情页浏览
- 按最新/最热/浏览量排序
- 点赞功能（IP 限流防刷）
- 浏览量统计

✅ **用户体验**
- 响应式设计，支持移动端
- 优雅的 UI 界面
- 实时消息提示

## 快速启动

### 环境要求
- Docker 20.10+
- Docker Compose 2.0+

### 启动方式

#### 方式一：使用启动脚本（推荐）
```bash
chmod +x start.sh
./start.sh
```

#### 方式二：手动启动
```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看日志
docker compose logs -f
```

### 访问地址
- **前端页面**: http://localhost:3000
- **后端 API**: http://localhost:5000

### 停止服务
```bash
docker compose down
```

## 项目结构

```
.
├── backend/                 # 后端 Flask 应用
│   ├── app.py              # 主应用入口和 API 接口
│   ├── config.py           # 配置文件
│   ├── models.py           # 数据模型
│   ├── requirements.txt    # Python 依赖
│   └── Dockerfile          # 后端 Docker 镜像
├── frontend/               # 前端 Vue3 应用
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── router/        # 路由配置
│   │   ├── api/           # API 封装
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   ├── package.json        # 前端依赖
│   ├── vite.config.js     # Vite 配置
│   └── Dockerfile         # 前端 Docker 镜像
├── uploads/                # 图片上传目录
├── docker-compose.yml      # Docker Compose 配置
├── start.sh               # 启动脚本
└── README.md              # 项目说明
```

## API 接口文档

### 分类接口
- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类
- `DELETE /api/categories/:id` - 删除分类

### 作品接口
- `GET /api/artworks` - 获取作品列表（支持分页、筛选、排序）
- `GET /api/artworks/:id` - 获取作品详情（自动增加浏览量）
- `POST /api/artworks` - 上传新作品
- `PUT /api/artworks/:id` - 更新作品信息
- `DELETE /api/artworks/:id` - 删除作品
- `POST /api/artworks/:id/like` - 点赞作品（IP 限流）

## 默认数据

系统启动时会自动创建以下默认分类：
- 书法
- 国画
- 油画
- 水彩
- 素描

## 开发说明

### 后端开发
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

## 注意事项

1. 上传的图片最大支持 10MB
2. 点赞功能每个 IP 24 小时内只能点赞一次
3. 所有数据存储在 SQLite 数据库中
4. 生产环境请修改 SECRET_KEY 配置

## 许可证

MIT License
