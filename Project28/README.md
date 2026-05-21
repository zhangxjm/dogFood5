# 民宿房源基础信息管理系统

基于 Go 语言开发的民宿房源管理系统，支持房型管理、房间设施管理、房源状态管理和线下入住登记功能。

## 技术栈

- **后端框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL 8.0
- **配置管理**: Viper
- **容器化**: Docker & Docker Compose

## 项目结构

```
.
├── cmd/
│   └── main.go          # 程序入口
├── internal/
│   ├── config/          # 配置加载
│   ├── database/        # 数据库初始化
│   ├── model/           # 数据模型
│   ├── repository/      # 数据访问层
│   └── handler/         # API 处理器
├── docker-compose.yml   # Docker 配置
├── config.yaml          # 应用配置
├── go.mod
└── go.sum
```

## 快速开始

### 1. 启动数据库

```bash
docker-compose up -d
```

### 2. 启动应用

```bash
go run cmd/main.go
```

服务器将在 `http://localhost:8080` 启动。

## API 接口文档

### 房型管理 (Room Types)

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/room-types | 创建房型 |
| GET | /api/room-types | 获取所有房型 |
| GET | /api/room-types/:id | 获取单个房型 |
| PUT | /api/room-types/:id | 更新房型 |
| DELETE | /api/room-types/:id | 删除房型 |

**创建房型示例**:
```json
{
  "name": "标准大床房",
  "description": "温馨舒适的大床房",
  "price": 299.00,
  "area": 25.5,
  "max_guests": 2,
  "bed_count": 1
}
```

### 设施管理 (Facilities)

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/facilities | 创建设施 |
| GET | /api/facilities | 获取所有设施 |
| GET | /api/facilities/:id | 获取单个设施 |
| PUT | /api/facilities/:id | 更新设施 |
| DELETE | /api/facilities/:id | 删除设施 |

**创建设施示例**:
```json
{
  "name": "免费WiFi",
  "icon": "wifi",
  "description": "高速无线网络"
}
```

### 房源管理 (Rooms)

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/rooms | 创建房源 |
| GET | /api/rooms | 获取所有房源 |
| GET | /api/rooms?status=available | 按状态筛选 |
| GET | /api/rooms/:id | 获取单个房源 |
| PUT | /api/rooms/:id | 更新房源 |
| PATCH | /api/rooms/:id/status | 更新房源状态 |
| DELETE | /api/rooms/:id | 删除房源 |
| POST | /api/rooms/:id/facilities | 添加房间设施 |
| DELETE | /api/rooms/:id/facilities/:facility_id | 移除房间设施 |

**创建房源示例**:
```json
{
  "room_number": "101",
  "room_type_id": 1,
  "floor": 1,
  "status": "available",
  "description": "一楼海景房"
}
```

**房源状态**:
- `available` - 可入住
- `occupied` - 已入住
- `cleaning` - 清洁中
- `maintenance` - 维修中

### 入住登记 (Check-in)

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/checkins | 创建入住登记 |
| GET | /api/checkins | 获取所有入住记录 |
| GET | /api/checkins?active=true | 获取当前在住记录 |
| GET | /api/checkins/:id | 获取单个入住记录 |
| PUT | /api/checkins/:id | 更新入住记录 |
| POST | /api/checkins/:id/checkout | 退房 |
| DELETE | /api/checkins/:id | 删除入住记录 |

**创建入住登记示例**:
```json
{
  "room_id": 1,
  "customer_name": "张三",
  "id_card": "110101199001011234",
  "phone": "13800138000",
  "guest_count": 2,
  "deposit": 500.00,
  "remark": "需要额外的毛巾"
}
```

## 数据库配置

默认数据库配置（config.yaml）:

```yaml
database:
  host: localhost
  port: 3306
  username: root
  password: homestay123
  dbname: homestay_db
```

## 停止服务

```bash
# 停止应用
# Ctrl+C

# 停止数据库
docker-compose down
```
