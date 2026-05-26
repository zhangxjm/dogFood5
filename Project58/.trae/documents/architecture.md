# 河道周边环境巡查记录系统 技术架构文档

## 1. 整体架构设计

### 1.1 技术栈选型
- **后端框架**: Go Fiber v2.x
  - 高性能、低内存占用的 Go Web 框架
  - 完整的中间件生态
  - 优秀的路由性能
- **数据库**: MySQL 8.0
  - 成熟稳定的关系型数据库
  - 支持复杂查询和事务
  - 与 GORM ORM 兼容性好
- **ORM**: GORM v1.26.x
  - 功能丰富的 Go ORM 框架
  - 支持自动迁移
  - 关联查询能力强
- **前端**: 原生 HTML + CSS + JavaScript + ECharts
  - 无需构建工具，部署简单
  - ECharts 提供丰富的数据可视化
  - 轻量高效

### 1.2 系统架构图
```
┌─────────────────────────────────────────────────────────┐
│                     客户端浏览器                         │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐   │
│  │ 仪表盘  │  │ 点位管理 │  │ 巡查记录│  │ 台账汇总 │   │
│  └─────────┘  └──────────┘  └────────┘  └──────────┘   │
└─────────────────────────────┬───────────────────────────┘
                              │ HTTP/HTTPS
┌─────────────────────────────▼───────────────────────────┐
│                     Go Fiber 服务端                      │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐   │
│  │  路由   │  │ 中间件   │  │ 控制器 │  │  服务层  │   │
│  └─────────┘  └──────────┘  └────────┘  └──────────┘   │
│                    ┌──────────┐                         │
│                    │ GORM ORM │                         │
│                    └──────────┘                         │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                      MySQL 数据库                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  巡查点位表  │  │  巡查记录表  │  │  整改记录表  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.3 目录结构
```
project/
├── backend/                    # 后端 Go 代码
│   ├── main.go                 # 应用入口
│   ├── go.mod
│   ├── go.sum
│   ├── app/
│   │   ├── controllers/        # 控制器层
│   │   ├── models/             # 数据模型层
│   │   ├── services/           # 业务逻辑层
│   │   ├── routes/             # 路由定义
│   │   ├── middleware/         # 中间件
│   │   └── database/           # 数据库连接与初始化
│   ├── config/                 # 配置管理
│   └── pkg/                    # 公共工具包
├── frontend/                   # 前端静态文件
│   ├── index.html              # 首页
│   ├── css/
│   ├── js/
│   └── pages/                  # 各功能页面
├── docker/                     # Docker 配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── start.sh                    # 启动脚本 (Linux/Mac)
├── start.bat                   # 启动脚本 (Windows)
└── .env.example                # 环境变量示例
```

## 2. 数据库设计

### 2.1 巡查点位表 (inspection_points)
| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY AUTO_INCREMENT |
| name | VARCHAR(100) | 点位名称 | NOT NULL |
| location | VARCHAR(255) | 位置描述 | NOT NULL |
| river | VARCHAR(100) | 所属河道 | NOT NULL |
| longitude | DECIMAL(10,7) | 经度 | |
| latitude | DECIMAL(10,7) | 纬度 | |
| area | VARCHAR(100) | 所属区域 | |
| status | TINYINT | 状态(1启用0禁用) | DEFAULT 1 |
| description | TEXT | 点位描述 | |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 2.2 巡查记录表 (inspection_records)
| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY AUTO_INCREMENT |
| point_id | BIGINT UNSIGNED | 点位ID | FOREIGN KEY |
| inspection_time | DATETIME | 巡查时间 | NOT NULL |
| inspector | VARCHAR(50) | 巡查人员 | NOT NULL |
| problem_type | VARCHAR(50) | 问题类型 | NOT NULL |
| description | TEXT | 问题描述 | NOT NULL |
| severity | VARCHAR(20) | 严重程度 | |
| photo_url | VARCHAR(255) | 现场照片URL | |
| status | VARCHAR(20) | 整改状态 | DEFAULT 'pending' |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 2.3 整改记录表 (rectification_records)
| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY AUTO_INCREMENT |
| record_id | BIGINT UNSIGNED | 巡查记录ID | FOREIGN KEY |
| measures | TEXT | 整改措施 | NOT NULL |
| rectification_time | DATETIME | 整改时间 | |
| person_in_charge | VARCHAR(50) | 整改责任人 | |
| after_photo_url | VARCHAR(255) | 整改后照片URL | |
| status | VARCHAR(20) | 整改状态 | DEFAULT 'processing' |
| remarks | TEXT | 备注 | |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## 3. API 接口设计

### 3.1 巡查点位管理 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/points | 获取点位列表（支持筛选） |
| GET | /api/points/:id | 获取点位详情 |
| POST | /api/points | 新增点位 |
| PUT | /api/points/:id | 更新点位 |
| DELETE | /api/points/:id | 删除点位 |

### 3.2 巡查记录 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/records | 获取巡查记录列表（支持筛选） |
| GET | /api/records/:id | 获取巡查记录详情 |
| POST | /api/records | 新增巡查记录 |
| PUT | /api/records/:id | 更新巡查记录 |
| DELETE | /api/records/:id | 删除巡查记录 |

### 3.3 整改记录 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/records/:recordId/rectifications | 获取某记录的整改历史 |
| POST | /api/records/:recordId/rectifications | 新增整改记录 |
| PUT | /api/rectifications/:id | 更新整改记录 |

### 3.4 统计台账 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats/summary | 获取总览统计数据 |
| GET | /api/stats/by-time | 按时间范围统计 |
| GET | /api/stats/by-point | 按点位统计 |
| GET | /api/stats/by-type | 按问题类型统计 |
| GET | /api/stats/rectification | 整改情况统计 |
| GET | /api/stats/export | 导出台账数据 |

## 4. 核心模块设计

### 4.1 数据库初始化模块
- 启动时自动连接数据库
- 自动执行 GORM AutoMigrate 创建表结构
- 自动检查并插入初始化示例数据
- 支持幂等操作，重复启动不报错

### 4.2 中间件层
- CORS 中间件：处理跨域请求
- 日志中间件：记录请求日志
- 恢复中间件：捕获 panic 防止服务崩溃
- 静态文件服务：提供前端静态资源

### 4.3 数据校验
- 后端参数校验：使用 go-playground/validator
- 输入数据合法性检查
- 数据库事务保证数据一致性

## 5. 部署方案

### 5.1 Docker Compose 部署
- MySQL 8.0 容器
- Go Fiber 应用容器
- 数据卷持久化数据库数据
- 容器间网络互联

### 5.2 启动流程
1. 启动 MySQL 容器，等待数据库就绪
2. 启动 Go 应用容器
3. 应用自动连接数据库并执行迁移
4. 自动插入初始化数据
5. 服务启动完成，监听 8080 端口

## 6. 安全设计

### 6.1 输入验证
- 所有用户输入进行合法性校验
- 使用参数化查询防止 SQL 注入
- XSS 防护，对输出内容进行转义

### 6.2 错误处理
- 统一错误响应格式
- 不向客户端暴露敏感错误信息
- 记录详细错误日志便于排查
