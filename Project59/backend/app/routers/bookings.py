from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/bookings", tags=["预约管理"])


@router.get("/", response_model=List[schemas.Booking])
def read_bookings(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    course_id: Optional[int] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    bookings = crud.get_bookings(db, skip=skip, limit=limit, status=status, course_id=course_id, student_id=student_id)
    return bookings


@router.get("/{booking_id}", response_model=schemas.Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = crud.get_booking(db, booking_id=booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return booking


@router.post("/")
def create_booking(
    booking: schemas.BookingCreate,
    student_name: str = Query(...),
    student_phone: str = Query(...),
    student_email: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    student_data = schemas.StudentCreate(
        name=student_name,
        phone=student_phone,
        email=student_email
    )
    student = crud.get_or_create_student(db, student_data)
    
    booking.student_id = student.id
    
    course = crud.get_course(db, booking.course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    
    db_booking = crud.create_booking(db=db, booking=booking)
    if db_booking is None:
        raise HTTPException(status_code=400, detail="该时间段已有预约或名额已满")
    
    return {"message": "预约成功", "booking_id": db_booking.id, "student_id": student.id}


@router.put("/{booking_id}/status")
def update_booking_status(booking_id: int, booking_update: schemas.BookingUpdate, db: Session = Depends(get_db)):
    booking = crud.update_booking_status(db, booking_id, booking_update)
    if booking is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return {"message": "状态已更新", "status": booking.status}


@router.delete("/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = crud.delete_booking(db, booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return {"message": "预约已取消"}


@router.get("/check/conflict")
def check_conflict(
    course_id: int,
    booking_date: str,
    start_time: str,
    end_time: str,
    db: Session = Depends(get_db)
):
    has_conflict = crud.check_time_conflict(db, course_id, booking_date, start_time, end_time)
    return {"has_conflict": has_conflict}
