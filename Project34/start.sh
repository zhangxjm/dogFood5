#!/bin/bash

echo "等待数据库启动..."
sleep 10

echo "初始化数据库..."
python init_db.py

echo "启动Flask应用..."
exec python app.py
