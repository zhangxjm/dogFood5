# 🎠 亲子乐园预约系统

基于 Python FastAPI + Uniapp + SQLite 的亲子乐园线上预约小程序

## ✨ 功能特性

- **游玩项目选择**: 浏览所有可预约的游玩项目
- **场次预约**: 按日期选择场次进行预约
- **预约核销**: 管理员核销预约记录
- **儿童信息存档**: 管理儿童和监护人信息

## 🚀 快速开始

### 方式一：直接启动（推荐）

```bash
# Mac/Linux
chmod +x scripts/start.sh
./scripts/start.sh

# Windows
scripts\start.bat
```

### 方式二：Docker 启动

```bash
docker-compose up -d
docker exec -it project10-backend-1 python init_data.py
```

## 📱 前端运行

1. 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 用 HBuilderX 打开 `frontend` 目录
3. 点击 "运行" -> "运行到小程序模拟器" -> "微信开发者工具"

## 🌐 API 文档

启动后端服务后，访问:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📂 项目结构

```
Project10/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # API 接口
│   │   └── database.py     # 数据库模型
│   ├── init_data.py        # 初始化数据
│   └── requirements.txt    # 依赖
├── frontend/               # Uniapp 小程序
│   ├── pages/              # 页面
│   │   ├── index/          # 首页（项目列表）
│   │   ├── projects/       # 项目详情/预约
│   │   ├── children/       # 儿童信息管理
│   │   ├── reservations/   # 预约记录
│   │   └── admin/          # 核销管理
│   ├── utils/
│   │   └── api.js          # API 工具
│   ├── common/
│   │   └── uni.css         # 公共样式
│   ├── pages.json          # 路由配置
│   ├── manifest.json       # 小程序配置
│   └── App.vue             # 入口
├── docker-compose.yml
├── Dockerfile
└── scripts/                # 启动脚本
```

## 🔧 技术栈

**后端:**
- FastAPI - 现代、快速的 Python Web 框架
- SQLAlchemy - ORM 数据库工具
- Uvicorn - ASGI 服务器
- SQLite - 轻量级数据库

**前端:**
- Uniapp - 跨平台小程序框架
- Vue 3 - 渐进式 JavaScript 框架

## 📝 初始化数据

系统启动时会自动创建以下示例数据：

- 4个游玩项目：旋转木马、碰碰车、海盗船、滑梯乐园
- 未来7天每天5个场次（9:00-16:30）

## 💡 使用说明

1. **添加儿童信息**: 进入"儿童"页面，点击添加按钮填写信息
2. **预约项目**: 首页点击项目 -> 选择日期和场次 -> 选择儿童完成预约
3. **查看预约**: 进入"预约"页面查看所有预约记录
4. **核销预约**: 进入"核销"页面，输入预约ID进行核销

## 🔌 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /projects | 获取项目列表 |
| POST | /projects | 创建新项目 |
| GET | /sessions/{project_id} | 获取项目场次 |
| POST | /sessions | 创建新场次 |
| GET | /children | 获取儿童列表 |
| POST | /children | 添加儿童信息 |
| GET | /reservations | 获取预约列表 |
| POST | /reservations | 创建预约 |
| POST | /reservations/{id}/verify | 核销预约 |
