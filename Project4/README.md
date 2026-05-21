# 🏨 酒店房间预订系统

基于 **Python FastAPI** + **React** + **Ant Design** + **MySQL** 技术栈开发的完整酒店房间预订管理系统。

## ✨ 核心功能

- **房型管理**：创建、编辑、删除房型，设置价格、容纳人数、设施等
- **房间管理**：管理房间信息、状态（空闲/已入住/已预订/维修中）
- **在线预订**：选择日期、房型、房间，填写客户信息创建预订
- **订单确认**：确认待处理的预订订单
- **入住登记**：已确认预订的客人办理入住手续
- **退房结算**：已入住的客人办理退房手续
- **数据统计**：仪表盘展示房间状态、预订数量等关键数据

## 🎯 技术难点解决方案

### 1. 房间状态管理
- 四种状态：空闲(available)、已入住(occupied)、已预订(reserved)、维修中(maintenance)
- 状态自动流转：预订确认 → 已预订 → 入住 → 已入住 → 退房 → 空闲
- 状态同步：取消预订时自动检查是否还有其他预订，决定房间状态

### 2. 预订时间冲突检测
- 创建预订时自动检测指定房间在日期范围内是否已有有效预订
- 冲突条件：新预订的入住/退房时间与已有预订的时间范围存在重叠
- 支持状态过滤：只检查"已确认"和"已入住"的预订

### 3. 房价自动计算
- 根据房型价格和入住天数自动计算总价
- 支持实时预览价格
- 最少按1天计算

## 🚀 快速启动

### 前置要求
- Docker
- Docker Compose

### 启动方式

**方式一：使用启动脚本（推荐）**
```bash
chmod +x start.sh
./start.sh
```

**方式二：手动启动**
```bash
docker compose up -d --build
```

### 访问地址
- 前端界面: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 📁 项目结构

```
Project4/
├── backend/                 # 后端 FastAPI 应用
│   ├── main.py             # 主应用入口，API 路由
│   ├── models.py           # 数据库模型
│   ├── schemas.py          # Pydantic 数据模型
│   ├── crud.py             # 数据库操作
│   ├── database.py         # 数据库连接
│   ├── requirements.txt    # Python 依赖
│   └── Dockerfile          # 后端 Docker 配置
├── frontend/               # 前端 React 应用
│   ├── src/
│   │   ├── main.jsx       # 应用入口
│   │   ├── App.jsx        # 路由配置
│   │   ├── api/           # API 调用封装
│   │   ├── components/    # 通用组件
│   │   └── pages/         # 页面组件
│   ├── package.json        # Node.js 依赖
│   ├── vite.config.js      # Vite 配置
│   └── Dockerfile          # 前端 Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── init.sql               # 数据库初始化脚本
└── start.sh               # 启动脚本
```

## 🛠️ 技术栈

### 后端
- **FastAPI**: 现代、高性能的 Python Web 框架
- **SQLAlchemy**: ORM 数据库工具
- **Pydantic**: 数据验证
- **MySQL**: 关系型数据库
- **Uvicorn**: ASGI 服务器

### 前端
- **React 18**: UI 框架
- **Ant Design 5**: 企业级 UI 组件库
- **Vite**: 下一代前端构建工具
- **Axios**: HTTP 客户端
- **React Router**: 路由管理
- **Day.js**: 日期处理

## 📊 数据库模型

### RoomType (房型)
- id: 主键
- name: 房型名称
- description: 描述
- price_per_night: 每晚价格
- max_guests: 最大容纳人数
- amenities: 设施列表

### Room (房间)
- id: 主键
- room_number: 房间号
- room_type_id: 房型 ID
- floor: 楼层
- status: 状态 (available/occupied/reserved/maintenance)
- notes: 备注

### Customer (客户)
- id: 主键
- name: 姓名
- phone: 电话
- email: 邮箱
- id_card: 身份证号

### Booking (预订)
- id: 主键
- booking_no: 预订编号
- customer_id: 客户 ID
- room_id: 房间 ID
- check_in_date: 入住日期
- check_out_date: 退房日期
- num_guests: 入住人数
- total_price: 总价
- status: 状态 (pending/confirmed/checked_in/checked_out/cancelled)
- check_in_time: 实际入住时间
- check_out_time: 实际退房时间

## 🔧 常用命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 重新构建
docker compose build --no-cache
```

## 💡 使用流程

1. **添加房型**：进入"房型管理"页面，添加酒店的房型信息
2. **添加房间**：进入"房间管理"页面，添加具体的房间，关联房型
3. **创建预订**：进入"创建预订"页面，选择入住/退房日期，选择可用房间，填写客户信息
4. **确认预订**：进入"预订管理"页面，确认待处理的预订
5. **办理入住**：客户到达后，在预订管理中点击"入住"
6. **办理退房**：客户离开时，在预订管理中点击"退房"

## 📝 注意事项

- 系统启动时会自动初始化 5 种房型和 10 个房间作为示例数据
- 数据库数据通过 Docker Volume 持久化
- 开发环境下支持热重载，修改代码后自动更新

## 🔐 默认配置

- MySQL 根密码: `password`
- 数据库名: `hotel_booking`
- 后端端口: `8000`
- 前端端口: `3000`

如需修改配置，请编辑 `docker-compose.yml` 文件。
