@echo off
chcp 65001 >nul
echo === 启动社区生鲜食材后台管理系统 ===

echo 1. 启动 MySQL 容器...
docker-compose up -d

echo 2. 等待 MySQL 启动...
timeout /t 15 /nobreak >nul

echo 3. 启动后端服务...
cd backend
start cmd /c "mvn spring-boot:run"

echo 4. 等待后端服务启动...
timeout /t 30 /nobreak >nul

echo 5. 安装前端依赖...
cd ../frontend
call npm install

echo 6. 启动前端服务...
call npm run dev

echo.
echo === 服务启动完成 ===
echo 后端地址: http://localhost:8080
echo 前端地址: http://localhost:3000
echo MySQL地址: localhost:3306
echo 默认账号: admin / admin123
pause
