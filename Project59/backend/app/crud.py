from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List, Optional
from . import models, schemas


def get_courses(db: Session, skip: int = 0, limit: int = 100, instrument: Optional[str] = None):
    query = db.query(models.Course).filter(models.Course.is_active == 1)
    if instrument:
        query = query.filter(models.Course.instrument == instrument)
    return query.offset(skip).limit(limit).all()


def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()


def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def update_course(db: Session, course_id: int, course: schemas.CourseCreate):
    db_course = get_course(db, course_id)
    if db_course:
        for key, value in course.model_dump().items():
            setattr(db_course, key, value)
        db.commit()
        db.refresh(db_course)
    return db_course


def delete_course(db: Session, course_id: int):
    db_course = get_course(db, course_id)
    if db_course:
        db_course.is_active = 0
        db.commit()
    return db_course


def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()


def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()


def get_student_by_phone(db: Session, phone: str):
    return db.query(models.Student).filter(models.Student.phone == phone).first()


def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def get_or_create_student(db: Session, student_data: schemas.StudentCreate):
    existing = get_student_by_phone(db, student_data.phone)
    if existing:
        return existing
    return create_student(db, student_data)


def get_bookings(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None, course_id: Optional[int] = None, student_id: Optional[int] = None):
    query = db.query(models.Booking)
    if status:
        query = query.filter(models.Booking.status == status)
    if course_id:
        query = query.filter(models.Booking.course_id == course_id)
    if student_id:
        query = query.filter(models.Booking.student_id == student_id)
    return query.order_by(models.Booking.booking_date.desc(), models.Booking.start_time.desc()).offset(skip).limit(limit).all()


def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def check_time_conflict(db: Session, course_id: int, booking_date: str, start_time: str, end_time: str, exclude_booking_id: Optional[int] = None):
    query = db.query(models.Booking).filter(
        models.Booking.course_id == course_id,
        models.Booking.booking_date == booking_date,
        models.Booking.status != "cancelled"
    )
    if exclude_booking_id:
        query = query.filter(models.Booking.id != exclude_booking_id)
    
    bookings = query.all()
    for booking in bookings:
        if (start_time < booking.end_time and end_time > booking.start_time):
            existing_count = db.query(models.Booking).filter(
                models.Booking.course_id == course_id,
                models.Booking.booking_date == booking_date,
                models.Booking.start_time == booking.start_time,
                models.Booking.status != "cancelled"
            ).count()
            course = get_course(db, course_id)
            if course and existing_count >= course.max_students:
                return True
    return False


def create_booking(db: Session, booking: schemas.BookingCreate):
    if check_time_conflict(db, booking.course_id, booking.booking_date, booking.start_time, booking.end_time):
        return None
    
    db_booking = models.Booking(**booking.model_dump(), status="confirmed")
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def update_booking_status(db: Session, booking_id: int, booking_update: schemas.BookingUpdate):
    db_booking = get_booking(db, booking_id)
    if db_booking:
        db_booking.status = booking_update.status
        if booking_update.notes:
            db_booking.notes = booking_update.notes
        db.commit()
        db.refresh(db_booking)
    return db_booking


def delete_booking(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if db_booking:
        db_booking.status = "cancelled"
        db.commit()
    return db_booking


def get_lesson_records(db: Session, skip: int = 0, limit: int = 100, course_id: Optional[int] = None, student_id: Optional[int] = None):
    query = db.query(models.LessonRecord)
    if course_id or student_id:
        query = query.join(models.Booking)
        if course_id:
            query = query.filter(models.Booking.course_id == course_id)
        if student_id:
            query = query.filter(models.Booking.student_id == student_id)
    return query.order_by(models.LessonRecord.created_at.desc()).offset(skip).limit(limit).all()


def get_lesson_record(db: Session, record_id: int):
    return db.query(models.LessonRecord).filter(models.LessonRecord.id == record_id).first()


def get_lesson_record_by_booking(db: Session, booking_id: int):
    return db.query(models.LessonRecord).filter(models.LessonRecord.booking_id == booking_id).first()


def create_lesson_record(db: Session, record: schemas.LessonRecordCreate):
    existing = get_lesson_record_by_booking(db, record.booking_id)
    if existing:
        return existing
    
    db_record = models.LessonRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    booking = get_booking(db, record.booking_id)
    if booking and booking.status != "completed":
        booking.status = "completed"
        db.commit()
    
    return db_record


def update_lesson_record(db: Session, record_id: int, record_update: schemas.LessonRecordUpdate):
    db_record = get_lesson_record(db, record_id)
    if db_record:
        update_data = record_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_record, key, value)
        
        if db_record.actual_start_time and db_record.actual_end_time:
            duration = (db_record.actual_end_time - db_record.actual_start_time).total_seconds() / 60
            db_record.duration_minutes = int(duration)
        
        db.commit()
        db.refresh(db_record)
    return db_record


def get_statistics(db: Session):
    total_courses = db.query(models.Course).filter(models.Course.is_active == 1).count()
    total_bookings = db.query(models.Booking).count()
    total_completed = db.query(models.Booking).filter(models.Booking.status == "completed").count()
    total_duration = db.query(func.coalesce(func.sum(models.LessonRecord.duration_minutes), 0)).scalar()
    
    completed_bookings = db.query(models.Booking).filter(models.Booking.status == "completed").all()
    total_revenue = sum(booking.course.price for booking in completed_bookings if booking.course)
    
    return {
        "total_courses": total_courses,
        "total_bookings": total_bookings,
        "total_completed_lessons": total_completed,
        "total_duration_minutes": total_duration,
        "total_revenue": total_revenue
    }


def get_instruments(db: Session):
    result = db.query(models.Course.instrument).filter(models.Course.is_active == 1).distinct().all()
    return [row[0] for row in result]
