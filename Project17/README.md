# 小微企业人事档案管理系统

基于 Spring Boot + React 的小微企业人事档案管理系统，用于管理员工基础信息、入职离职记录、岗位调配登记等。

## 功能特性

- 员工基础信息管理（新增、编辑、删除、查看）
- 入职离职记录管理
- 岗位调配登记
- 员工信息快速搜索
- 员工状态管理
- Docker 容器化部署

## 技术栈

### 后端
- Java 11
- Spring Boot 2.7.x
- Spring Data JPA
- MySQL 8.0

### 前端
- React 18
- React Router 6
- Ant Design 5.x
- Axios
- Day.js

## 快速启动

### 方式一：使用 Docker Compose 启动（推荐）

```bash
# 进入项目根目录
cd Project17

# 启动所有服务
docker-compose up -d

# 查看启动状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

启动成功后访问：
- 前端页面：http://localhost:3000
- 后端接口：http://localhost:8080

### 方式二：本地开发启动

#### 启动后端

```bash
cd backend

# 配置 MySQL 数据库（修改 application.properties）
# 确保本地 MySQL 已启动，创建数据库 hr_system

# 启动 Spring Boot 应用
mvn spring-boot:run
```

#### 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 数据库配置

默认数据库配置：
- 数据库名：hr_system
- 用户名：root
- 密码：123456
- 端口：3306

如需修改，请编辑 `backend/src/main/resources/application.properties` 或 `docker-compose.yml`。

## 项目结构

```
Project17/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/hrsystem/
│   │   │   │       ├── HrSystemApplication.java
│   │   │   │       ├── controller/
│   │   │   │       │   └── EmployeeController.java
│   │   │   │       ├── entity/
│   │   │   │       │   ├── Employee.java
│   │   │   │       │   ├── EmploymentRecord.java
│   │   │   │       │   └── PositionChange.java
│   │   │   │       ├── repository/
│   │   │   │       │   ├── EmployeeRepository.java
│   │   │   │       │   ├── EmploymentRecordRepository.java
│   │   │   │       │   └── PositionChangeRepository.java
│   │   │   │       └── service/
│   │   │   │           └── EmployeeService.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── pom.xml
│   └── Dockerfile
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── pages/
│   │   │   ├── EmployeeList.js
│   │   │   ├── EmployeeForm.js
│   │   │   └── EmployeeDetail.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

## API 接口

### 员工管理
- `GET /api/employees` - 获取所有员工
- `GET /api/employees/{id}` - 根据ID获取员工
- `POST /api/employees` - 新增员工
- `PUT /api/employees/{id}` - 更新员工信息
- `DELETE /api/employees/{id}` - 删除员工
- `GET /api/employees/search?keyword={keyword}` - 搜索员工

### 入职离职记录
- `GET /api/employees/{id}/employment-records` - 获取员工入职离职记录
- `POST /api/employees/{id}/employment-records` - 添加入职离职记录

### 岗位调配记录
- `GET /api/employees/{id}/position-changes` - 获取员工岗位调配记录
- `POST /api/employees/{id}/position-changes` - 添加岗位调配记录

## 使用说明

1. 启动系统后，访问 http://localhost:3000 进入员工列表页面
2. 点击"新增员工"按钮添加新员工
3. 在员工列表中可以搜索、编辑、删除员工
4. 点击员工姓名或"查看"按钮进入员工详情页
5. 在详情页可以添加入职离职记录和岗位调配记录

## 停止服务

```bash
# 使用 Docker Compose 停止
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```
