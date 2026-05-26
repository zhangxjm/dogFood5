from models import db, Student, Course, Schedule, ClassRecord
from datetime import date, datetime, timedelta
import random

def init_data(app):
    with app.app_context():
        db.create_all()
        
        if Course.query.count() > 0:
            print('数据已存在，跳过初始化')
            return
        
        print('开始初始化数据...')
        
        courses_data = [
            {'name': '儿童素描基础', 'description': '适合5-8岁儿童素描入门课程', 'color': '#1890ff'},
            {'name': '水彩画入门', 'description': '学习水彩画基础技法', 'color': '#52c41a'},
            {'name': '创意绘画', 'description': '培养孩子的创意思维和绘画能力', 'color': '#faad14'},
            {'name': '国画入门', 'description': '传统国画基础技法学习', 'color': '#f5222d'},
            {'name': '漫画创作', 'description': '学习漫画人物和场景创作', 'color': '#722ed1'},
            {'name': '手工艺术', 'description': '手工制作与创意艺术结合课程', 'color': '#13c2c2'}
        ]
        
        courses = []
        for c_data in courses_data:
            course = Course(**c_data)
            db.session.add(course)
            courses.append(course)
        
        db.session.flush()
        
        names = ['小明', '小红', '小华', '小丽', '小强', '小芳', '小军', '小燕', '小龙', '小敏', '小杰', '小婷']
        genders = ['男', '女']
        parents = ['张先生', '李女士', '王先生', '赵女士', '陈先生', '刘女士', '黄先生', '周女士', '吴先生', '郑女士', '孙先生', '钱女士']
        
        students = []
        for i in range(12):
            total = random.choice([20, 30, 40, 50])
            used = random.randint(0, total // 2)
            student = Student(
                name=names[i],
                gender=random.choice(genders),
                age=random.randint(5, 12),
                parent_name=parents[i],
                phone=f'138{random.randint(10000000, 99999999)}',
                total_hours=total,
                used_hours=used,
                remaining_hours=total - used,
                enrollment_date=date.today() - timedelta(days=random.randint(30, 365))
            )
            db.session.add(student)
            students.append(student)
        
        db.session.flush()
        
        days = [1, 2, 3, 4, 5, 6, 0]
        time_slots = [
            ('09:00', '10:30'), ('10:30', '12:00'), ('14:00', '15:30'), ('15:30', '17:00'), ('17:00', '18:30')
        ]
        
        for i, student in enumerate(students):
            course = courses[i % len(courses)]
            day = days[i % len(days)]
            slot = time_slots[i % len(time_slots)]
            
            schedule = Schedule(
                student_id=student.id,
                course_id=course.id,
                day_of_week=day,
                start_time=slot[0],
                end_time=slot[1],
                start_date=date.today() - timedelta(days=random.randint(30, 100)),
                end_date=date.today() + timedelta(days=random.randint(60, 180)),
                is_active=True
            )
            db.session.add(schedule)
        
        db.session.flush()
        
        for student in students:
            num_classes = random.randint(3, 10)
            for _ in range(num_classes):
                days_ago = random.randint(1, 60)
                class_date = date.today() - timedelta(days=days_ago)
                
                schedule = Schedule.query.filter_by(student_id=student.id).first()
                if schedule:
                    class_record = ClassRecord(
                        student_id=student.id,
                        course_id=schedule.course_id,
                        schedule_id=schedule.id,
                        class_date=class_date,
                        start_time=schedule.start_time,
                        end_time=schedule.end_time,
                        hours=random.choice([1, 2]),
                        status='completed',
                        notes=random.choice(['表现优秀', '认真听讲', '积极参与', '进步明显', ''])
                    )
                    db.session.add(class_record)
        
        db.session.commit()
        print('数据初始化完成！')
