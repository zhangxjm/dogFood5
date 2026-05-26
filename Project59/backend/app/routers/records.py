from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/records", tags=["授课记录"])


@router.get("/")
def read_records(
    skip: int = 0,
    limit: int = 100,
    course_id: Optional[int] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    records = crud.get_lesson_records(db, skip=skip, limit=limit, course_id=course_id, student_id=student_id)
    result = []
    for record in records:
        record_dict = {
            "id": record.id,
            "booking_id": record.booking_id,
            "course_name": record.booking.course.name if record.booking and record.booking.course else "",
            "student_name": record.booking.student.name if record.booking and record.booking.student else "",
            "teacher_name": record.booking.course.teacher_name if record.booking and record.booking.course else "",
            "booking_date": record.booking.booking_date if record.booking else "",
            "actual_start_time": record.actual_start_time,
            "actual_end_time": record.actual_end_time,
            "duration_minutes": record.duration_minutes,
            "content_summary": record.content_summary,
            "homework": record.homework,
            "teacher_notes": record.teacher_notes,
            "student_feedback": record.student_feedback,
            "created_at": record.created_at
        }
        result.append(record_dict)
    return result


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    stats = crud.get_statistics(db)
    return stats


@router.get("/{record_id}")
def read_record(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_lesson_record(db, record_id=record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="记录不存在")
    
    result = {
        "id": record.id,
        "booking_id": record.booking_id,
        "course_name": record.booking.course.name if record.booking and record.booking.course else "",
        "student_name": record.booking.student.name if record.booking and record.booking.student else "",
        "teacher_name": record.booking.course.teacher_name if record.booking and record.booking.course else "",
        "booking_date": record.booking.booking_date if record.booking else "",
        "start_time": record.booking.start_time if record.booking else "",
        "end_time": record.booking.end_time if record.booking else "",
        "actual_start_time": record.actual_start_time,
        "actual_end_time": record.actual_end_time,
        "duration_minutes": record.duration_minutes,
        "content_summary": record.content_summary,
        "homework": record.homework,
        "teacher_notes": record.teacher_notes,
        "student_feedback": record.student_feedback,
        "created_at": record.created_at
    }
    return result


@router.get("/booking/{booking_id}")
def read_record_by_booking(booking_id: int, db: Session = Depends(get_db)):
    record = crud.get_lesson_record_by_booking(db, booking_id=booking_id)
    if record is None:
        return None
    
    result = {
        "id": record.id,
        "booking_id": record.booking_id,
        "actual_start_time": record.actual_start_time,
        "actual_end_time": record.actual_end_time,
        "duration_minutes": record.duration_minutes,
        "content_summary": record.content_summary,
        "homework": record.homework,
        "teacher_notes": record.teacher_notes,
        "student_feedback": record.student_feedback,
        "created_at": record.created_at
    }
    return result


@router.post("/")
def create_record(record: schemas.LessonRecordCreate, db: Session = Depends(get_db)):
    booking = crud.get_booking(db, record.booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    
    db_record = crud.create_lesson_record(db=db, record=record)
    return {"message": "记录创建成功", "record_id": db_record.id}


@router.post("/{record_id}/start")
def start_lesson(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_lesson_record(db, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="记录不存在")
    
    update_data = schemas.LessonRecordUpdate(
        actual_start_time=datetime.now()
    )
    updated = crud.update_lesson_record(db, record_id, update_data)
    return {"message": "授课已开始", "start_time": updated.actual_start_time}


@router.post("/{record_id}/end")
def end_lesson(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_lesson_record(db, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="记录不存在")
    
    update_data = schemas.LessonRecordUpdate(
        actual_end_time=datetime.now()
    )
    updated = crud.update_lesson_record(db, record_id, update_data)
    return {
        "message": "授课已结束",
        "end_time": updated.actual_end_time,
        "duration_minutes": updated.duration_minutes
    }


@router.put("/{record_id}")
def update_record(record_id: int, record_update: schemas.LessonRecordUpdate, db: Session = Depends(get_db)):
    record = crud.update_lesson_record(db, record_id, record_update)
    if record is None:
        raise HTTPException(status_code=404, detail="记录不存在")
    return {"message": "记录已更新"}
