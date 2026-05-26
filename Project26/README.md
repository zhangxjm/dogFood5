# 节日礼品清单管理系统

基于 Node.js 前后端分离的节日礼品清单管理系统。

## 功能模块
- 📊 总览仪表盘（统计数据 + 即将到来的提醒）
- 📦 礼品分类清单（CRUD + 分类筛选 + 搜索）
- 👥 送礼对象管理（含偏好、关系、备注）
- ⏰ 时间提醒（按日期排序、完成状态切换）
- 📜 历史送礼记录（按对象筛选查看）

## 技术栈
- **后端**: Node.js + Express + Mongoose
- **数据库**: MongoDB（Docker 容器）
- **前端**: React 18 + React Router + fetch
- **部署**: 一键启动脚本（随机端口）

## 快速启动

### Windows
```bat
start.bat
```

### macOS / Linux
```bash
chmod +x start.sh stop.sh
./start.sh
```

启动后：
- 前端地址（随机端口）: http://localhost:XXXX
- 后端 API（随机端口）: http://localhost:XXXX/api
- MongoDB（随机端口）: localhost:XXXX

停止：
```
stop.bat    # Windows
./stop.sh   # macOS/Linux
```

## 说明
- 脚本会自动从 Docker Hub 拉取 mongo:6 镜像
- 首次启动自动执行种子数据（8 个礼品、5 个对象、3 个提醒、4 条历史）
- 所有端口均为随机分配，避免冲突
- 依赖只需首次安装，后续启动直接复用
