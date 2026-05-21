#!/usr/bin/env python
"""API 接口自测脚本"""

import json
import sys
import os

BASE_URL = "http://localhost:5001"

def test_api():
    """测试所有 API 接口"""
    import urllib.request
    import urllib.error
    
    results = []
    
    def test(name, method, path, data=None, headers=None):
        """执行单个测试"""
        url = f"{BASE_URL}{path}"
        try:
            if data:
                if isinstance(data, dict):
                    data = json.dumps(data).encode('utf-8')
                req = urllib.request.Request(url, data=data, method=method)
                req.add_header('Content-Type', 'application/json')
            else:
                req = urllib.request.Request(url, method=method)
            
            if headers:
                for k, v in headers.items():
                    req.add_header(k, v)
            
            with urllib.request.urlopen(req, timeout=10) as resp:
                body = json.loads(resp.read().decode('utf-8'))
                status = resp.status
                results.append({
                    'name': name,
                    'status': status,
                    'success': 200 <= status < 300,
                    'response': body
                })
                print(f"✅ {name} [{status}]")
                if isinstance(body, list):
                    print(f"   返回 {len(body)} 条数据")
                elif isinstance(body, dict):
                    if 'artworks' in body:
                        print(f"   返回 {len(body['artworks'])} 条作品")
                    elif 'message' in body:
                        print(f"   消息: {body['message']}")
                return True
        except urllib.error.HTTPError as e:
            body = json.loads(e.read().decode('utf-8')) if e.fp else {}
            results.append({
                'name': name,
                'status': e.code,
                'success': False,
                'response': body
            })
            print(f"❌ {name} [{e.code}]: {body.get('error', body)}")
            return False
        except Exception as e:
            results.append({
                'name': name,
                'status': 0,
                'success': False,
                'error': str(e)
            })
            print(f"❌ {name} [ERROR]: {e}")
            return False
    
    print("=" * 60)
    print("  书画作品展示平台 - API 接口自测")
    print("=" * 60)
    print(f"\n测试地址: {BASE_URL}\n")
    
    # 1. 测试根路由
    test("1. 获取 API 根信息", "GET", "/")
    
    # 2. 测试分类接口
    test("2. 获取分类列表", "GET", "/api/categories")
    
    # 3. 测试作品列表
    test("3. 获取作品列表", "GET", "/api/artworks")
    
    # 4. 测试排序功能
    test("4. 按点赞排序作品", "GET", "/api/artworks?sort_by=likes")
    
    # 5. 测试分页
    test("5. 分页获取作品", "GET", "/api/artworks?page=1&per_page=5")
    
    print("\n" + "=" * 60)
    
    # 统计结果
    success_count = sum(1 for r in results if r['success'])
    total_count = len(results)
    
    print(f"\n📊 测试结果: {success_count}/{total_count} 通过")
    
    if success_count == total_count:
        print("🎉 所有接口测试通过！")
    else:
        print("⚠️  部分接口测试失败，请检查服务是否正常运行")
    
    print("=" * 60)
    
    return success_count == total_count

if __name__ == '__main__':
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1]
    
    try:
        import urllib.request
        # 先检查服务是否可用
        req = urllib.request.Request(f"{BASE_URL}/")
        urllib.request.urlopen(req, timeout=3)
        print(f"✅ 服务已启动: {BASE_URL}")
        test_api()
    except Exception as e:
        print(f"❌ 无法连接到服务: {BASE_URL}")
        print(f"   请确保服务已启动: docker compose up -d")
        print(f"   错误信息: {e}")
        sys.exit(1)
