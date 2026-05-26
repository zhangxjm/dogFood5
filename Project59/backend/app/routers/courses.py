from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/courses", tags=["课程管理"])


@router.get("/", response_model=List[schemas.Course])
def read_courses(
    skip: int = 0,
    limit: int = 100,
    instrument: Optional[str] = None,
    db: Session = Depends(get_db)
):
    courses = crud.get_courses(db, skip=skip, limit=limit, instrument=instrument)
    return courses


@router.get("/instruments")
def read_instruments(db: Session = Depends(get_db)):
    instruments = crud.get_instruments(db)
    return {"instruments": instruments}


@router.get("/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course(db, course_id=course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    return course


@router.post("/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db=db, course=course)


@router.put("/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = crud.update_course(db, course_id, course)
    if db_course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    return db_course


@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = crud.delete_course(db, course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    return {"message": "课程已下架"}


@router.get("/{course_id}/bookings")
def get_course_bookings(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course(db, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="课程不存在")
    bookings = crud.get_bookings(db, course_id=course_id)
    return {"bookings": bookings}
