#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "========================================"
echo "  API 测试脚本"
echo "========================================"

echo ""
echo "1. 测试健康检查..."
curl -s http://localhost:8080/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8080/health
echo ""

echo "2. 获取仪表盘统计..."
curl -s "$BASE_URL/dashboard/stats" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/dashboard/stats"
echo ""

echo "3. 获取所有品类..."
curl -s "$BASE_URL/categories" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/categories"
echo ""

echo "4. 获取所有商品..."
curl -s "$BASE_URL/products" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/products"
echo ""

echo "5. 获取所有客户..."
curl -s "$BASE_URL/customers" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/customers"
echo ""

echo "6. 获取补货提醒..."
curl -s "$BASE_URL/alerts/restock" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/alerts/restock"
echo ""

echo "7. 创建采购记录测试..."
curl -s -X POST "$BASE_URL/purchases" \
  -H "Content-Type: application/json" \
  -d '{"customer_id": 1, "product_id": 1, "quantity": 2, "remark": "测试采购"}' \
  | python3 -m json.tool 2>/dev/null || curl -s -X POST "$BASE_URL/purchases" -H "Content-Type: application/json" -d '{"customer_id": 1, "product_id": 1, "quantity": 2, "remark": "测试采购"}'
echo ""

echo "========================================"
echo "  测试完成！"
echo "========================================"
