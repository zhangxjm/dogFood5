from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime, date

from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/api/checkins", tags=["checkins"])


@router.post("/", response_model=schemas.CheckInResponse)
def create_checkin(checkin: schemas.CheckInCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == checkin.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()
    existing_checkin = db.query(models.CheckIn).filter(
        and_(
            models.CheckIn.user_id == checkin.user_id,
            models.CheckIn.check_date >= datetime(today.year, today.month, today.day)
        )
    ).first()

    if existing_checkin:
        return existing_checkin

    db_checkin = models.CheckIn(
        user_id=checkin.user_id,
        work_id=checkin.work_id
    )
    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)
    return db_checkin


@router.get("/", response_model=List[schemas.CheckInResponse])
def list_checkins(
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.CheckIn)
    if user_id is not None:
        query = query.filter(models.CheckIn.user_id == user_id)
    checkins = query.order_by(models.CheckIn.created_at.desc()).offset(skip).limit(limit).all()
    return checkins


@router.get("/today/{user_id}")
def check_today_checkin(user_id: int, db: Session = Depends(get_db)):
    today = date.today()
    checkin = db.query(models.CheckIn).filter(
        and_(
            models.CheckIn.user_id == user_id,
            models.CheckIn.check_date >= datetime(today.year, today.month, today.day)
        )
    ).first()

    return {"checked_in": checkin is not None, "checkin": checkin}
