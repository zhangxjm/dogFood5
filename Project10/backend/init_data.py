from app.database import SessionLocal, Project, Session as DBSession
from datetime import date, timedelta

def init_data():
    db = SessionLocal()
    
    projects = [
        {"name": "旋转木马", "description": "经典的旋转木马，适合各年龄段儿童", "duration_minutes": 5, "max_people_per_session": 12},
        {"name": "碰碰车", "description": "刺激有趣的碰碰车，需要家长陪同", "duration_minutes": 8, "max_people_per_session": 8},
        {"name": "海盗船", "description": "惊险的海盗船，体验失重的快感", "duration_minutes": 5, "max_people_per_session": 20},
        {"name": "滑梯乐园", "description": "大型滑梯组合，孩子们的最爱", "duration_minutes": 30, "max_people_per_session": 15},
    ]
    
    for p in projects:
        project = Project(**p)
        db.add(project)
    db.commit()
    
    projects = db.query(Project).all()
    today = date.today()
    
    for project in projects:
        for day in range(7):
            current_date = today + timedelta(days=day)
            sessions = [
                {"project_id": project.id, "date": current_date, "start_time": "09:00", "end_time": "09:30", "available_slots": project.max_people_per_session},
                {"project_id": project.id, "date": current_date, "start_time": "10:00", "end_time": "10:30", "available_slots": project.max_people_per_session},
                {"project_id": project.id, "date": current_date, "start_time": "14:00", "end_time": "14:30", "available_slots": project.max_people_per_session},
                {"project_id": project.id, "date": current_date, "start_time": "15:00", "end_time": "15:30", "available_slots": project.max_people_per_session},
                {"project_id": project.id, "date": current_date, "start_time": "16:00", "end_time": "16:30", "available_slots": project.max_people_per_session},
            ]
            for s in sessions:
                session = DBSession(**s)
                db.add(session)
    db.commit()
    db.close()
    print("数据初始化完成！")

if __name__ == "__main__":
    init_data()
