# 社区团购团长端系统

基于 Python Flask + Uniapp + MySQL 构建的社区团购团长端管理系统

## 功能特性

### 🛒 商品管理
- 商品列表查看
- 商品添加/编辑
- 商品上架/下架
- 商品分类管理

### 📋 订单管理
- 订单列表查看
- 订单详情查看
- 订单状态筛选
- 订单统计

### ✓ 订单核销
- 提货码核销
- 订单ID核销
- 核销后自动结算收益

### 📍 自提点管理
- 自提点列表
- 自提点添加/编辑
- 自提点启用/禁用

### 💰 收益统计
- 累计收益查看
- 今日收益统计
- 收益明细列表
- 可提现余额

### 💳 提现管理
- 在线申请提现
- 多种收款方式（微信、支付宝、银行卡）
- 提现记录查询

## 技术栈

### 后端
- **框架**: Python Flask 2.3.3
- **ORM**: Flask-SQLAlchemy 3.1.1
- **数据库**: MySQL 8.0
- **跨域**: Flask-CORS

### 前端
- **框架**: Uniapp (Vue 2.x)
- **UI**: 原生组件

## 快速开始

### 方式一：Docker 一键启动（推荐）

```bash
# 一键启动（包含后端和数据库）
chmod +x start.sh
./start.sh
```

### 方式二：手动启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
export DATABASE_URL=mysql+pymysql://groupbuy:groupbuy123@localhost:3306/groupbuy

# 启动服务
python run.py
```

## 服务地址

- 后端 API: http://localhost:5000
- MySQL: localhost:3306

## 默认账号

- 手机号: `13800138000`
- 密码: `123456`

## API 接口

### 认证
- `POST /api/auth/login` - 登录
- `GET /api/auth/profile/:id` - 获取用户信息

### 商品
- `GET /api/product/list/:leaderId` - 商品列表
- `GET /api/product/detail/:id` - 商品详情
- `POST /api/product/add` - 添加商品
- `PUT /api/product/edit/:id` - 编辑商品
- `PUT /api/product/status/:id` - 商品上下架
- `GET /api/product/categories` - 商品分类

### 订单
- `GET /api/order/list/:leaderId` - 订单列表
- `GET /api/order/detail/:id` - 订单详情
- `POST /api/order/verify` - 订单核销
- `POST /api/order/create` - 创建订单
- `GET /api/order/statistics/:leaderId` - 订单统计

### 自提点
- `GET /api/pickup/list/:leaderId` - 自提点列表
- `GET /api/pickup/detail/:id` - 自提点详情
- `POST /api/pickup/add` - 添加自提点
- `PUT /api/pickup/edit/:id` - 编辑自提点
- `PUT /api/pickup/status/:id` - 自提点状态

### 收益
- `GET /api/earnings/list/:leaderId` - 收益列表
- `GET /api/earnings/statistics/:leaderId` - 收益统计

### 提现
- `GET /api/withdrawal/list/:leaderId` - 提现记录
- `POST /api/withdrawal/apply` - 申请提现

## 目录结构

```
Project8/
├── backend/                # 后端服务
│   ├── app/               # Flask 应用
│   │   ├── __init__.py   # 应用初始化
│   │   ├── models.py     # 数据模型
│   │   └── routes/       # 路由
│   ├── database/          # 数据库
│   │   └── init.sql      # 初始化脚本
│   ├── Dockerfile        # Docker 配置
│   ├── docker-compose.yml # Docker Compose 配置
│   ├── requirements.txt  # Python 依赖
│   └── run.py           # 启动文件
├── frontend/             # 前端 Uniapp
│   ├── pages/           # 页面文件
│   │   ├── login/       # 登录页
│   │   ├── index/       # 首页
│   │   ├── product/     # 商品管理
│   │   ├── order/       # 订单管理
│   │   ├── pickup/      # 自提点管理
│   │   ├── earnings/    # 收益统计
│   │   ├── withdrawal/  # 提现管理
│   │   └── mine/        # 我的页面
│   ├── utils/           # 工具函数
│   ├── App.vue          # 应用入口
│   ├── main.js          # 主入口
│   ├── pages.json       # 页面配置
│   ├── manifest.json    # 应用配置
│   └── package.json     # 依赖配置
├── start.sh             # 启动脚本
└── README.md            # 项目说明
```

## 核心业务流程

### 订单核销流程
1. 用户下单支付，订单状态变为待提货
2. 系统自动计算佣金并创建收益记录（待结算状态）
3. 团长输入提货码或选择订单进行核销
4. 核销成功后，订单状态变为已核销
5. 收益自动结算到团长账户，可提现余额增加

### 提现流程
1. 团长发起提现申请
2. 系统检查可用余额是否充足
3. 扣除对应金额的可用余额，转入冻结余额
4. 创建提现记录，状态为审核中
5. 审核通过后打款，更新提现状态

## 数据库设计

- `leader` - 团长表
- `pickup_point` - 自提点表
- `category` - 商品分类表
- `product` - 商品表
- `order` - 订单表
- `order_item` - 订单明细表
- `earnings` - 收益表
- `withdrawal` - 提现表
- `leader_wallet` - 团长钱包表

## 常见问题

### 1. 如何查看后端日志？
```bash
cd backend
docker-compose logs -f backend
```

### 2. 如何停止服务？
```bash
cd backend
docker-compose down
```

### 3. 如何重启服务？
```bash
cd backend
docker-compose restart
```

### 4. 前端如何运行？
Uniapp 项目需要使用 HBuilderX 打开运行，或使用 vue-cli 编译运行。

## 许可证

MIT
