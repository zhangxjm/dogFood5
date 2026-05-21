from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
from app.security import get_password_hash
from datetime import date, timedelta


def init_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin:
            hashed_password = get_password_hash("admin123")
            admin = models.User(
                username="admin",
                email="admin@example.com",
                nickname="管理员",
                hashed_password=hashed_password,
                is_admin=True
            )
            db.add(admin)
            db.commit()
            print("管理员账号创建成功: admin / admin123")
        else:
            print("管理员账号已存在")

        demo_user = db.query(models.User).filter(models.User.username == "demo").first()
        if not demo_user:
            hashed_password = get_password_hash("demo123")
            demo_user = models.User(
                username="demo",
                email="demo@example.com",
                nickname="演示用户",
                hashed_password=hashed_password,
                is_admin=False
            )
            db.add(demo_user)
            db.commit()
            print("演示账号创建成功: demo / demo123")
        else:
            print("演示账号已存在")

        today = date.today()
        existing_task = db.query(models.Task).filter(
            models.Task.start_date <= today,
            models.Task.end_date >= today
        ).first()

        if not existing_task:
            task = models.Task(
                title="今日练习：横画练习",
                description="练习基本横画的写法，注意起笔、行笔、收笔的节奏",
                content="练习横画10遍，注意保持笔画平直、力度均匀",
                start_date=today,
                end_date=today + timedelta(days=7),
                is_active=True,
                created_by=admin.id
            )
            db.add(task)
            db.commit()
            print("示例任务创建成功")
        else:
            print("已有进行中的任务")

    except Exception as e:
        print(f"初始化数据库时出错: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("开始初始化数据库...")
    init_db()
    print("数据库初始化完成!")
