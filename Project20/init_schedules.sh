#!/bin/bash

echo "📅 生成教练练车时段..."
cd backend
go run data/init_schedules.go
echo "✅ 完成！"
