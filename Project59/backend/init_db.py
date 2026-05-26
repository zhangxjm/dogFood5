from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app import models, schemas, crud

Base.metadata.create_all(bind=engine)

def init_data():
    db = SessionLocal()
    
    try:
        if db.query(models.Course).count() > 0:
            print("数据已存在，跳过初始化")
            return
        
        courses_data = [
            schemas.CourseCreate(
                name="钢琴入门课程",
                instrument="钢琴",
                description="适合零基础学员，从基础乐理和指法开始学习，循序渐进掌握钢琴演奏技巧。",
                teacher_name="李明老师",
                duration_minutes=60,
                price=200.0,
                max_students=1,
                is_active=1
            ),
            schemas.CourseCreate(
                name="吉他弹唱班",
                instrument="吉他",
                description="学习吉他基本和弦、扫弦技巧，能够弹唱流行歌曲。",
                teacher_name="王芳老师",
                duration_minutes=60,
                price=150.0,
                max_students=3,
                is_active=1
            ),
            schemas.CourseCreate(
                name="小提琴精品课",
                instrument="小提琴",
                description="一对一精品教学，注重音准和弓法训练，培养良好的演奏习惯。",
                teacher_name="张强老师",
                duration_minutes=90,
                price=300.0,
                max_students=1,
                is_active=1
            ),
            schemas.CourseCreate(
                name="古筝兴趣班",
                instrument="古筝",
                description="了解古筝历史文化，学习基本指法和经典曲目。",
                teacher_name="刘婷老师",
                duration_minutes=60,
                price=180.0,
                max_students=2,
                is_active=1
            ),
            schemas.CourseCreate(
                name="架子鼓入门",
                instrument="架子鼓",
                description="学习基本节奏型、手脚协调训练，能够演奏简单曲目。",
                teacher_name="赵磊老师",
                duration_minutes=60,
                price=160.0,
                max_students=1,
                is_active=1
            ),
            schemas.CourseCreate(
                name="声乐训练课",
                instrument="声乐",
                description="科学发声方法训练，音准节奏练习，演唱技巧提升。",
                teacher_name="陈雪老师",
                duration_minutes=45,
                price=120.0,
                max_students=4,
                is_active=1
            )
        ]
        
        created_courses = []
        for course_data in courses_data:
            course = crud.create_course(db, course_data)
            created_courses.append(course)
            print(f"已创建课程: {course.name}")
        
        students_data = [
            schemas.StudentCreate(name="张伟", phone="13800138001", email="zhangwei@example.com"),
            schemas.StudentCreate(name="李娜", phone="13800138002", email="lina@example.com"),
            schemas.StudentCreate(name="王强", phone="13800138003", email="wangqiang@example.com"),
            schemas.StudentCreate(name="刘洋", phone="13800138004", email="liuyang@example.com"),
            schemas.StudentCreate(name="陈静", phone="13800138005", email="chenjing@example.com")
        ]
        
        created_students = []
        for student_data in students_data:
            student = crud.create_student(db, student_data)
            created_students.append(student)
            print(f"已创建学员: {student.name}")
        
        today = datetime.now()
        bookings_data = []
        
        for i in range(5):
            booking_date = (today + timedelta(days=i+1)).strftime("%Y-%m-%d")
            course_idx = i % len(created_courses)
            student_idx = i % len(created_students)
            
            start_hour = 9 + (i * 2) % 8
            start_time = f"{start_hour:02d}:00"
            end_time = f"{start_hour + 1:02d}:00"
            
            bookings_data.append({
                "course_id": created_courses[course_idx].id,
                "student_id": created_students[student_idx].id,
                "booking_date": booking_date,
                "start_time": start_time,
                "end_time": end_time
            })
        
        for i in range(3):
            booking_date = (today - timedelta(days=i+1)).strftime("%Y-%m-%d")
            course_idx = (i + 2) % len(created_courses)
            student_idx = (i + 1) % len(created_students)
            
            start_hour = 14 + i
            start_time = f"{start_hour:02d}:00"
            end_time = f"{start_hour + 1:02d}:00"
            
            booking = schemas.BookingCreate(
                course_id=created_courses[course_idx].id,
                student_id=created_students[student_idx].id,
                booking_date=booking_date,
                start_time=start_time,
                end_time=end_time
            )
            created_booking = crud.create_booking(db, booking)
            
            if created_booking:
                created_booking.status = "completed"
                db.commit()
                
                record_data = schemas.LessonRecordCreate(
                    booking_id=created_booking.id,
                    content_summary=f"本节课学习了{created_courses[course_idx].name}的基础技巧，学员掌握情况良好。",
                    homework="练习今日学习的曲目30分钟，注意手型和节奏。",
                    teacher_notes="学员学习态度认真，需要加强音阶练习。",
                    student_feedback="老师讲解很清楚，收获很大！"
                )
                record = crud.create_lesson_record(db, record_data)
                
                actual_start = datetime.strptime(f"{booking_date} {start_time}", "%Y-%m-%d %H:%M")
                actual_end = actual_start + timedelta(minutes=created_courses[course_idx].duration_minutes)
                
                update_data = schemas.LessonRecordUpdate(
                    actual_start_time=actual_start,
                    actual_end_time=actual_end,
                    duration_minutes=created_courses[course_idx].duration_minutes
                )
                crud.update_lesson_record(db, record.id, update_data)
                
                print(f"已创建历史预约和记录: {booking_date} {start_time}")
        
        for bk in bookings_data:
            booking = schemas.BookingCreate(**bk)
            created = crud.create_booking(db, booking)
            if created:
                print(f"已创建预约: {bk['booking_date']} {bk['start_time']}")
        
        print("\n数据初始化完成！")
        print(f"课程数量: {len(created_courses)}")
        print(f"学员数量: {len(created_students)}")
        print(f"预约数量: {db.query(models.Booking).count()}")
        print(f"授课记录数量: {db.query(models.LessonRecord).count()}")
        
    except Exception as e:
        print(f"初始化失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_data()
