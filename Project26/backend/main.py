from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="少儿绘画课时记录系统")


@app.get("/")
def read_root():
    return {"message": "少儿绘画课时记录系统 API"}


@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict(), used_hours=0)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@app.get("/students/", response_model=List[schemas.Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    students = db.query(models.Student).offset(skip).limit(limit).all()
    for student in students:
        student.remaining_hours = student.remaining_hours
    return students


@app.get("/students/{student_id}", response_model=schemas.Student)
def read_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="学员不存在")
    student.remaining_hours = student.remaining_hours
    return student


@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student_update: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="学员不存在")
    for key, value in student_update.dict(exclude_unset=True).items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    student.remaining_hours = student.remaining_hours
    return student


@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="学员不存在")
    db.delete(student)
    db.commit()
    return {"message": "删除成功"}


@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


@app.get("/courses/", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    return courses


@app.get("/courses/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    return course


@app.put("/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course_update: schemas.CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    for key, value in course_update.dict(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    db.delete(course)
    db.commit()
    return {"message": "删除成功"}


@app.post("/records/", response_model=schemas.ClassRecord)
def create_record(record: schemas.ClassRecordCreate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == record.student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="学员不存在")
    
    if student.remaining_hours < record.hours_used:
        raise HTTPException(status_code=400, detail="剩余课时不足")
    
    db_record = models.ClassRecord(**record.dict())
    db.add(db_record)
    
    student.used_hours += record.hours_used
    
    db.commit()
    db.refresh(db_record)
    
    result = db_record.__dict__
    result["student_name"] = student.name
    course = db.query(models.Course).filter(models.Course.id == record.course_id).first()
    result["course_name"] = course.name if course else None
    return result


@app.get("/records/", response_model=List[schemas.ClassRecord])
def read_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    records = db.query(models.ClassRecord).offset(skip).limit(limit).all()
    result = []
    for record in records:
        r = record.__dict__
        r["student_name"] = record.student.name if record.student else None
        r["course_name"] = record.course.name if record.course else None
        result.append(r)
    return result


@app.get("/records/student/{student_id}", response_model=List[schemas.ClassRecord])
def read_student_records(student_id: int, db: Session = Depends(get_db)):
    records = db.query(models.ClassRecord).filter(models.ClassRecord.student_id == student_id).all()
    result = []
    for record in records:
        r = record.__dict__
        r["student_name"] = record.student.name if record.student else None
        r["course_name"] = record.course.name if record.course else None
        result.append(r)
    return result


@app.post("/schedules/", response_model=schemas.Schedule)
def create_schedule(schedule: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = models.Schedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    result = db_schedule.__dict__
    student = db.query(models.Student).filter(models.Student.id == schedule.student_id).first()
    course = db.query(models.Course).filter(models.Course.id == schedule.course_id).first()
    result["student_name"] = student.name if student else None
    result["course_name"] = course.name if course else None
    return result


@app.get("/schedules/", response_model=List[schemas.Schedule])
def read_schedules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    schedules = db.query(models.Schedule).offset(skip).limit(limit).all()
    result = []
    for schedule in schedules:
        s = schedule.__dict__
        s["student_name"] = schedule.student.name if schedule.student else None
        s["course_name"] = schedule.course.name if schedule.course else None
        result.append(s)
    return result


@app.get("/schedules/week/", response_model=List[schemas.Schedule])
def read_week_schedules(db: Session = Depends(get_db)):
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    schedules = db.query(models.Schedule).filter(
        models.Schedule.date >= start_of_week,
        models.Schedule.date <= end_of_week
    ).all()
    
    result = []
    for schedule in schedules:
        s = schedule.__dict__
        s["student_name"] = schedule.student.name if schedule.student else None
        s["course_name"] = schedule.course.name if schedule.course else None
        result.append(s)
    return result


@app.put("/schedules/{schedule_id}", response_model=schemas.Schedule)
def update_schedule(schedule_id: int, schedule_update: schemas.ScheduleUpdate, db: Session = Depends(get_db)):
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="排班不存在")
    for key, value in schedule_update.dict(exclude_unset=True).items():
        setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    
    result = schedule.__dict__
    result["student_name"] = schedule.student.name if schedule.student else None
    result["course_name"] = schedule.course.name if schedule.course else None
    return result


@app.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="排班不存在")
    db.delete(schedule)
    db.commit()
    return {"message": "删除成功"}


@app.get("/statistics/hours")
def get_hours_statistics(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    total_hours = sum(s.total_hours for s in students)
    used_hours = sum(s.used_hours for s in students)
    remaining_hours = total_hours - used_hours
    
    return {
        "total_students": len(students),
        "total_hours": total_hours,
        "used_hours": used_hours,
        "remaining_hours": remaining_hours
    }
