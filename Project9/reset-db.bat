@echo off
chcp 65001 >nul
echo === 重置数据库（解决乱码问题） ===

echo 1. 停止并删除MySQL容器...
docker-compose down -v

echo 2. 删除旧数据目录...
rmdir /s /q mysql\data 2>nul

echo 3. 重新启动MySQL容器...
docker-compose up -d

echo 4. 等待MySQL初始化完成（约30秒）...
timeout /t 30 /nobreak >nul

echo.
echo === 数据库重置完成 ===
echo MySQL已重新初始化，数据应为UTF-8编码
echo 请重启后端服务后测试
pause
