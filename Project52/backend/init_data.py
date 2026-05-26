from sqlalchemy.orm import Session
import models
from datetime import datetime


def init_sample_data(db: Session):
    category_count = db.query(models.Category).count()
    if category_count > 0:
        return

    categories_data = [
        {"name": "Python编程", "description": "Python编程语言学习笔记，包括基础语法、高级特性、常用库等", "color": "#3B82F6"},
        {"name": "数据结构与算法", "description": "常见数据结构与算法的学习与总结", "color": "#10B981"},
        {"name": "机器学习", "description": "机器学习算法原理、实践与应用", "color": "#F59E0B"},
        {"name": "Web开发", "description": "前后端开发技术栈学习笔记", "color": "#EF4444"},
        {"name": "数据库技术", "description": "SQL、NoSQL数据库原理与优化", "color": "#8B5CF6"},
    ]

    categories = []
    for cat_data in categories_data:
        category = models.Category(**cat_data)
        db.add(category)
        categories.append(category)
    db.commit()
    for cat in categories:
        db.refresh(cat)

    notes_data = [
        {
            "title": "Python装饰器详解",
            "content": """装饰器是Python中一种强大的语法糖，可以在不修改原函数代码的情况下增加函数的功能。

常见的装饰器类型：
1. 函数装饰器 - 最常用的装饰器类型
2. 类装饰器 - 使用类实现的装饰器
3. 带参数的装饰器 - 可以接收参数的装饰器

示例代码：
```python
def log_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_decorator
def greet(name):
    return f"Hello, {name}!"
```""",
            "tags": ["Python", "装饰器", "高级特性"],
            "category_id": 1
        },
        {
            "title": "快速排序算法原理",
            "content": """快速排序是一种基于分治思想的排序算法，平均时间复杂度为O(n log n)。

算法步骤：
1. 选择一个基准元素(pivot)
2. 将数组分为两部分：小于基准的和大于基准的
3. 递归地对两部分进行排序

Python实现：
```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```""",
            "tags": ["算法", "排序", "分治"],
            "category_id": 2
        },
        {
            "title": "线性回归模型原理",
            "content": """线性回归是机器学习中最基础的监督学习算法，用于预测连续值。

模型公式：y = wX + b

损失函数：均方误差(MSE)
MSE = (1/n) * Σ(yi - ŷi)²

梯度下降更新规则：
w = w - lr * ∂MSE/∂w
b = b - lr * ∂MSE/∂b

其中lr是学习率，控制每次更新的步长。""",
            "tags": ["机器学习", "回归", "统计学"],
            "category_id": 3
        },
        {
            "title": "FastAPI框架入门",
            "content": """FastAPI是一个现代、高性能的Python Web框架，基于标准Python类型提示。

主要特性：
1. 自动生成API文档(Swagger UI)
2. 类型提示自动验证参数
3. 异步支持(async/await)
4. 高性能，接近Node.js和Go

创建简单应用：
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```""",
            "tags": ["FastAPI", "Python", "后端"],
            "category_id": 4
        },
        {
            "title": "MySQL索引优化",
            "content": """索引是数据库中用于加速查询的数据结构，合理使用索引可以大幅提升查询性能。

索引类型：
1. 主键索引 - PRIMARY KEY
2. 唯一索引 - UNIQUE
3. 普通索引 - INDEX
4. 全文索引 - FULLTEXT

优化建议：
- 为WHERE、JOIN、ORDER BY字段创建索引
- 避免在索引列上使用函数
- 使用EXPLAIN分析查询执行计划
- 定期维护索引(OPTIMIZE TABLE)""",
            "tags": ["MySQL", "索引", "性能优化"],
            "category_id": 5
        },
        {
            "title": "Python异步编程(asyncio)",
            "content": """asyncio是Python的异步编程库，提供了编写并发代码的框架。

关键概念：
1. 协程(Coroutine) - 使用async def定义
2. 事件循环(Event Loop) - 管理协程的执行
3. 任务(Task) - 封装协程的对象

示例代码：
```python
import asyncio

async def fetch_data(url):
    print(f"Fetching {url}")
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    tasks = [fetch_data(f"url{i}") for i in range(3)]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
```""",
            "tags": ["Python", "异步", "并发"],
            "category_id": 1
        },
        {
            "title": "二叉树遍历算法",
            "content": """二叉树有三种基本遍历方式：前序、中序、后序。

1. 前序遍历：根 -> 左 -> 右
2. 中序遍历：左 -> 根 -> 右
3. 后序遍历：左 -> 右 -> 根

Python实现：
```python
def preorder(root):
    if root:
        print(root.val)
        preorder(root.left)
        preorder(root.right)

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)

def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val)
```""",
            "tags": ["数据结构", "树", "遍历"],
            "category_id": 2
        },
        {
            "title": "Vue3组合式API",
            "content": """Vue3引入了组合式API，提供了更灵活的代码组织方式。

核心函数：
1. setup() - 组件的入口函数
2. ref() - 创建响应式基本类型
3. reactive() - 创建响应式对象
4. computed() - 计算属性
5. watch() - 监听器

示例代码：
```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    
    onMounted(() => {
      console.log('Component mounted')
    })
    
    return { count, doubled }
  }
}
```""",
            "tags": ["Vue", "前端", "JavaScript"],
            "category_id": 4
        }
    ]

    for note_data in notes_data:
        note = models.Note(**note_data)
        db.add(note)
    db.commit()
