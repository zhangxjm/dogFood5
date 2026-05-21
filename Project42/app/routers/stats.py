from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app import schemas, crud, models
from app.database import get_db
from app.security import get_current_active_user

router = APIRouter(prefix="/stats", tags=["statistics"])


@router.get("/daily", response_model=List[schemas.CheckinStats])
def get_daily_stats(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.get_daily_checkin_stats(db=db, days=days)


@router.get("/monthly", response_model=List[schemas.MonthlyStats])
def get_monthly_stats(
    year: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if year is None:
        year = date.today().year
    return crud.get_monthly_checkin_stats(db=db, year=year)
