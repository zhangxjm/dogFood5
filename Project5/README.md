# 跑腿服务平台（简易版）

基于 Node.js NestJS + Vue3 + Vant + MongoDB 开发的跑腿服务平台。

## 核心功能

- ✅ 服务类型管理
- ✅ 订单发布
- ✅ 跑腿员接单
- ✅ 订单状态更新
- ✅ 评价系统

## 技术难点实现

- ✅ 订单抢单逻辑（乐观锁，防止重复接单）
- ✅ 状态实时推送（WebSocket 实时通知）
- ✅ 评价管理（自动计算跑腿员平均评分）

## 技术栈

### 后端
- NestJS 10.x
- MongoDB + Mongoose
- WebSocket (Socket.io)

### 前端
- Vue 3
- Vant UI
- Vue Router
- Axios
- Socket.io-client

## 快速开始

### 方式一：一键启动（推荐）

```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

1. **启动 MongoDB**
   ```bash
   docker-compose up -d
   ```

2. **启动后端服务**
   ```bash
   cd backend
   npm install
   node init-data.js  # 初始化服务类型数据
   npm run start
   ```

3. **启动前端服务**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 访问地址

- 前端页面: http://localhost:5173
- 后端API: http://localhost:3000

## 使用说明

1. 注册/登录用户，可以选择"顾客"或"跑腿员"角色
2. 顾客可以发布跑腿订单
3. 跑腿员可以在首页看到待接订单并接单
4. 接单后可以更新订单状态（取件、送达等）
5. 订单完成后顾客可以对跑腿员进行评价
6. 所有状态变更通过 WebSocket 实时推送

## 订单状态流转

```
待接单 → 已接单 → 已取件 → 已送达 → 已完成
   ↓
 已取消
```

## API 接口

### 用户
- POST /users - 创建用户
- GET /users/:id - 获取用户信息
- GET /users/phone/:phone - 通过手机号获取用户

### 服务类型
- GET /service-types - 获取所有服务类型
- POST /service-types - 创建服务类型
- PUT /service-types/:id - 更新服务类型
- DELETE /service-types/:id - 删除服务类型

### 订单
- GET /orders - 获取所有订单
- GET /orders/pending - 获取待接订单
- GET /orders/:id - 获取订单详情
- GET /orders/customer/:customerId - 获取顾客的订单
- GET /orders/runner/:runnerId - 获取跑腿员的订单
- POST /orders - 创建订单
- PUT /orders/:id/accept - 接单
- PUT /orders/:id/status - 更新订单状态

### 评价
- GET /reviews - 获取所有评价
- GET /reviews/runner/:runnerId - 获取跑腿员的评价
- POST /reviews - 创建评价
