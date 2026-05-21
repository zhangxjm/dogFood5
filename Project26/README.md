# 🎨 少儿绘画课时记录系统

一个基于 Python 全栈技术开发的少儿绘画课时管理系统，支持学员管理、课程管理、课时记录和课程排班功能。

## ✨ 功能特性

- **📊 首页概览**：系统统计数据展示，本周课程安排，学员课时情况
- **👦 学员管理**：学员信息的增删改查，课时管理
- **📚 课程管理**：课程信息管理
- **📝 课时记录**：登记学员上课情况，自动扣减课时
- **📅 课程排班**：简易的课程排班规划

## 🛠️ 技术栈

- **后端**：FastAPI + SQLAlchemy + SQLite
- **前端**：Streamlit + Pandas
- **部署**：Docker

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 启动后端服务：
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

3. 启动前端界面（新开终端）：
```bash
streamlit run frontend/app.py --server.port 8501
```

### 方式三：使用 Docker

```bash
docker-compose up -d
```

## 🌐 访问地址

- **前端界面**: http://localhost:8501
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 📁 项目结构

```
.
├── backend/
│   ├── __init__.py
│   ├── database.py      # 数据库配置
│   ├── models.py        # 数据模型
│   ├── schemas.py       # Pydantic 模式
│   └── main.py          # FastAPI 主应用
├── frontend/
│   ├── __init__.py
│   ├── api_client.py    # API 客户端
│   └── app.py           # Streamlit 前端应用
├── requirements.txt     # Python 依赖
├── Dockerfile          # Docker 镜像配置
├── docker-compose.yml  # Docker Compose 配置
├── start.sh            # 启动脚本
└── README.md           # 项目说明
```

## 💡 使用说明

1. **添加课程**：首先在"课程管理"中添加绘画课程
2. **添加学员**：在"学员管理"中添加学员信息和购买的课时
3. **课程排班**：在"课程排班"中安排学员的上课时间
4. **登记上课**：学员上课时在"课时记录"中登记，自动扣减课时
5. **查看统计**：在"首页概览"查看整体统计数据

## ⚠️ 注意事项

- 系统使用 SQLite 数据库，数据存储在 `art_class.db` 文件中
- 剩余课时不足3课时的学员会在首页高亮显示
- 登记上课时会自动检查学员剩余课时，不足时无法登记
