import time
from app import app, db


def wait_for_db():
    max_retries = 30
    retry_interval = 2
    
    for i in range(max_retries):
        try:
            with app.app_context():
                db.session.execute("SELECT 1")
                db.session.commit()
            print("数据库连接成功！")
            return True
        except Exception as e:
            print(f"等待数据库连接... ({i+1}/{max_retries})")
            time.sleep(retry_interval)
    
    print("无法连接到数据库")
    return False


if __name__ == '__main__':
    print("正在初始化数据库...")
    wait_for_db()
    
    with app.app_context():
        db.create_all()
        
        from app import Category, init_categories
        init_categories()
        
        print("数据库初始化完成！")
