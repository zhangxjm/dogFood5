#!/usr/bin/env python
"""数据初始化脚本 - 确保默认分类数据存在"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Category

def init_default_categories():
    """初始化默认分类数据"""
    with app.app_context():
        db.create_all()
        
        default_categories = [
            {'name': '书法', 'description': '传统书法作品展示'},
            {'name': '国画', 'description': '中国传统绘画作品'},
            {'name': '油画', 'description': '西方油画艺术作品'},
            {'name': '水彩', 'description': '水彩画作品展示'},
            {'name': '素描', 'description': '素描速写作品'}
        ]
        
        created_count = 0
        for cat_data in default_categories:
            if not Category.query.filter_by(name=cat_data['name']).first():
                category = Category(**cat_data)
                db.session.add(category)
                created_count += 1
                print(f"✅ 创建分类: {cat_data['name']}")
            else:
                print(f"⏭️  分类已存在: {cat_data['name']}")
        
        db.session.commit()
        
        total = Category.query.count()
        print(f"\n📊 当前分类总数: {total}")
        return created_count

if __name__ == '__main__':
    print("=" * 50)
    print("  书画作品展示平台 - 数据初始化")
    print("=" * 50)
    print()
    
    count = init_default_categories()
    
    print()
    print("=" * 50)
    if count > 0:
        print(f"✅ 初始化完成！新增 {count} 个分类")
    else:
        print("✅ 所有分类数据已存在")
    print("=" * 50)
