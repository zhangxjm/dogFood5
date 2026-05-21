# 🏭 仓库物料管理系统

基于 Go Beego 框架开发的小型仓库物料分类管理系统，支持物料库区管理、物料编号录入、物料出入库流水记录。

## ✨ 功能特性

- **物料库区管理**
  - 库区创建、编辑、删除
  - 库区类型分类（原材料、半成品、成品、危险物品）
  - 状态管理（启用/禁用）
  - 搜索和分页

- **物料管理**
  - 物料创建、编辑、删除
  - 物料编号、规格型号、计量单位管理
  - 所属库区分配
  - 库存数量管理
  - 最低库存预警
  - 单价和供应商管理

- **出入库流水记录**
  - 物料入库操作
  - 物料出库操作
  - 出入库流水查询
  - 按物料、类型、日期范围筛选
  - 操作人记录
  - 批次号管理

- **数据统计面板**
  - 物料总数统计
  - 库区数量统计
  - 总入库量统计
  - 总出库量统计
  - 低库存预警数量
  - 库存总值计算

## 🛠 技术栈

- **后端框架**: Beego v2
- **编程语言**: Go 1.21+
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **ORM**: GORM
- **前端**: 原生 HTML + CSS + JavaScript

## 📋 环境要求

- Docker 和 Docker Compose
- Go 1.21 或更高版本
- MySQL 客户端（可选）

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

**Mac/Linux 系统**:
```bash
chmod +x start.sh
./start.sh
```

**Windows 系统**:
```cmd
start.bat
```

### 方式二：手动启动

1.  **启动 Docker 服务**
    ```bash
    docker-compose up -d
    ```

2.  **等待 MySQL 启动并初始化数据库**
    ```bash
    sleep 15
    docker exec -i warehouse-mysql mysql -uroot -proot123456 < docs/sql/init.sql
    ```

3.  **安装 Go 依赖**
    ```bash
    go mod tidy
    ```

4.  **启动应用**
    ```bash
    go run main.go
    ```

## 🌐 访问地址

启动成功后，访问以下地址：

- **Web 管理界面**: http://localhost:8080
- **API 接口地址**: http://localhost:8080/api

## 📁 项目结构

```
warehouse/
├── main.go                 # 应用入口
├── go.mod                  # Go 模块配置
├── go.sum                  # 依赖版本锁定
├── docker-compose.yml      # Docker 容器配置
├── conf/
│   └── app.conf            # Beego 应用配置
├── controllers/            # 控制器层
│   ├── base.go             # 基础控制器
│   ├── default.go          # 默认控制器
│   ├── warehouse_area.go   # 库区控制器
│   ├── material.go         # 物料控制器
│   └── inventory.go        # 出入库控制器
├── models/                 # 数据模型层
│   └── models.go           # 数据库模型定义
├── routers/                # 路由配置
│   └── router.go           # API 路由定义
├── utils/                  # 工具类
│   ├── db.go               # 数据库连接
│   └── redis.go            # Redis 连接
├── views/                  # 视图模板
│   └── index.html          # 主页面
├── docs/
│   └── sql/
│       └── init.sql        # 数据库初始化脚本
├── start.sh                # Mac/Linux 启动脚本
└── start.bat               # Windows 启动脚本
```

## 🔌 API 接口文档

### 物料库区 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/warehouse-area/list | 获取库区列表 |
| GET | /api/warehouse-area/:id | 获取库区详情 |
| POST | /api/warehouse-area/ | 创建库区 |
| PUT | /api/warehouse-area/:id | 更新库区 |
| DELETE | /api/warehouse-area/:id | 删除库区 |
| PUT | /api/warehouse-area/:id/status | 更新库区状态 |

### 物料 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/material/list | 获取物料列表 |
| GET | /api/material/:id | 获取物料详情 |
| POST | /api/material/ | 创建物料 |
| PUT | /api/material/:id | 更新物料 |
| DELETE | /api/material/:id | 删除物料 |
| PUT | /api/material/:id/status | 更新物料状态 |

### 出入库 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/inventory/list | 获取出入库记录列表 |
| GET | /api/inventory/:id | 获取出入库记录详情 |
| POST | /api/inventory/inbound | 物料入库 |
| POST | /api/inventory/outbound | 物料出库 |
| GET | /api/inventory/statistics | 获取统计数据 |

## 🗄 数据库配置

默认数据库配置：

- **主机**: localhost
- **端口**: 3306
- **数据库**: warehouse
- **用户名**: warehouse
- **密码**: warehouse123

如需修改配置，请编辑 `conf/app.conf` 文件。

## 📊 预置数据

系统启动后预置以下测试数据：

**库区**:
- A001 - 原材料库区A
- B001 - 半成品库区B
- C001 - 成品库区C

**物料**:
- MAT001 - 不锈钢板（1.5mm*1220mm*2440mm）
- MAT002 - 铝合金型材（6061-T6）
- MAT003 - 电机外壳（YX3-100）

## 🔧 常见问题

### 1. Docker 启动失败
- 确保 Docker Desktop 已启动
- 检查端口 3306 和 6379 是否被占用

### 2. 数据库连接失败
- 等待 MySQL 完全启动后重试
- 检查 conf/app.conf 中的数据库配置是否正确

### 3. Go 依赖下载失败
- 配置 Go 代理：`go env -w GOPROXY=https://goproxy.cn,direct`
- 确保网络连接正常

## 📝 开发说明

本项目采用 MVC 架构设计：
- **Model 层**: 数据模型和数据库操作
- **View 层**: 前端页面展示
- **Controller 层**: 业务逻辑处理和 API 接口

所有接口统一返回 JSON 格式：
```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

## 📄 许可证

MIT License

---

祝您使用愉快！🎉
