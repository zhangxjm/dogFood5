# 同城绿植养护服务预约系统

基于 Koa2 + Vue3 + MySQL 的全栈同城绿植养护服务预约平台。

## 功能特性

- 🪴 **养护服务管理** - 上架各类绿植养护服务项目
- 📅 **在线预约** - 用户选择服务并预约上门时间
- ✅ **服务记录** - 服务完成状态跟踪
- ⭐ **服务评价** - 用户对服务进行评分和评价

## 技术栈

- **后端**: Koa2 + MySQL + Sequelize
- **前端**: Vue3 + Vite + Element Plus + Vue Router
- **容器化**: Docker + Docker Compose

## 快速启动

### 方式一：Docker 启动（推荐）

```bash
# 克隆项目后直接启动
docker-compose up -d

# 查看启动状态
docker-compose logs -f
```

启动后访问:
- 前端: http://localhost:5173
- 后端: http://localhost:3000

### 方式二：本地启动

```bash
# 1. 启动 MySQL (需要本地安装 MySQL 并执行 backend/init.sql)

# 2. 启动后端
cd backend
npm install
npm run dev

# 3. 启动前端
cd frontend
npm install
npm run dev
```

## 项目结构

```
.
├── backend/          # Koa 后端服务
├── frontend/         # Vue3 前端应用
├── docker-compose.yml
└── README.md
```
