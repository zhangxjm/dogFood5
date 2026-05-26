from datetime import datetime, timedelta
from backend.app.database import SessionLocal
from backend.app import models


def init_database():
    db = SessionLocal()
    try:
        existing_users = db.query(models.User).count()
        if existing_users > 0:
            print("Database already has data, skipping initialization")
            return

        sample_users = [
            {"username": "zhangsan", "nickname": "张三", "avatar": ""},
            {"username": "lisi", "nickname": "李四", "avatar": ""},
            {"username": "wangwu", "nickname": "王五", "avatar": ""},
            {"username": "zhaoliu", "nickname": "赵六", "avatar": ""},
            {"username": "qianqi", "nickname": "钱七", "avatar": ""},
        ]

        users = []
        for user_data in sample_users:
            user = models.User(**user_data)
            db.add(user)
            users.append(user)
        db.flush()

        sample_tasks = [
            {
                "title": "每日一字：永",
                "description": "练习永字八法，掌握基本笔画",
                "reference_image": "",
                "deadline": None,
                "is_active": True
            },
            {
                "title": "楷书基础：横画练习",
                "description": "练习长横、短横、左尖横、右尖横",
                "reference_image": "",
                "deadline": None,
                "is_active": True
            },
            {
                "title": "楷书基础：竖画练习",
                "description": "练习垂露竖、悬针竖、短竖",
                "reference_image": "",
                "deadline": None,
                "is_active": True
            },
            {
                "title": "行书入门：连笔技巧",
                "description": "学习行书基本连笔方法",
                "reference_image": "",
                "deadline": None,
                "is_active": True
            },
            {
                "title": "临摹作品：兰亭序",
                "description": "临摹王羲之兰亭序选段",
                "reference_image": "",
                "deadline": None,
                "is_active": True
            },
        ]

        tasks = []
        for task_data in sample_tasks:
            task = models.Task(**task_data)
            db.add(task)
            tasks.append(task)
        db.flush()

        sample_works = []
        for i in range(8):
            work = models.Work(
                user_id=users[i % len(users)].id,
                task_id=tasks[i % len(tasks)].id,
                image_path=f"sample_{i+1}.jpg",
                description=f"这是用户 {users[i % len(users)].nickname} 的作品 #{i+1}",
                is_excellent=(i % 3 == 0),
                likes=(i * 3)
            )
            sample_works.append(work)
            db.add(work)
        db.flush()

        today = datetime.utcnow()
        for i, user in enumerate(users):
            for j in range(i + 1):
                check_date = today - timedelta(days=j)
                work = sample_works[(i + j) % len(sample_works)] if sample_works else None
                checkin = models.CheckIn(
                    user_id=user.id,
                    check_date=check_date,
                    work_id=work.id if work else None
                )
                db.add(checkin)

        db.commit()
        print("Database initialized successfully with sample data")

    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
    finally:
        db.close()
