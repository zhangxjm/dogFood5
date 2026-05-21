from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import uvicorn

from .database import engine, get_db, Base
from . import models, schemas, crud
from .scheduler import start_scheduler, stop_scheduler

Base.metadata.create_all(bind=engine)

app = FastAPI(title="自习室座位预约管理系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    start_scheduler()
    db = next(get_db())
    try:
        if not crud.get_users(db):
            crud.create_user(db, schemas.UserCreate(
                username="admin",
                email="admin@example.com",
                full_name="管理员"
            ))
            crud.create_user(db, schemas.UserCreate(
                username="user1",
                email="user1@example.com",
                full_name="用户1"
            ))
        if not crud.get_study_areas(db):
            area1 = crud.create_study_area(db, schemas.StudyAreaCreate(
                name="一楼自习区",
                description="安静学习区域，适合阅读和写作"
            ))
            area2 = crud.create_study_area(db, schemas.StudyAreaCreate(
                name="二楼讨论区",
                description="小组讨论区域，适合团队协作"
            ))
            for i in range(1, 21):
                crud.create_seat(db, schemas.SeatCreate(
                    seat_number=f"A{i:02d}",
                    area_id=area1.id,
                    row=(i - 1) // 5,
                    col=(i - 1) % 5,
                    has_power=i % 2 == 0,
                    has_window=i <= 5
                ))
            for i in range(1, 16):
                crud.create_seat(db, schemas.SeatCreate(
                    seat_number=f"B{i:02d}",
                    area_id=area2.id,
                    row=(i - 1) // 5,
                    col=(i - 1) % 5,
                    has_power=True,
                    has_window=False
                ))
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    stop_scheduler()


@app.get("/")
def read_root():
    return {"message": "自习室座位预约管理系统 API", "docs": "/docs"}


@app.get("/api/areas", response_model=List[schemas.StudyArea])
def read_areas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_study_areas(db, skip=skip, limit=limit)


@app.get("/api/areas/{area_id}", response_model=schemas.StudyArea)
def read_area(area_id: int, db: Session = Depends(get_db)):
    area = crud.get_study_area(db, area_id)
    if area is None:
        raise HTTPException(status_code=404, detail="自习区域不存在")
    return area


@app.post("/api/areas", response_model=schemas.StudyArea)
def create_area(area: schemas.StudyAreaCreate, db: Session = Depends(get_db)):
    return crud.create_study_area(db, area)


@app.put("/api/areas/{area_id}", response_model=schemas.StudyArea)
def update_area(area_id: int, area: schemas.StudyAreaCreate, db: Session = Depends(get_db)):
    db_area = crud.update_study_area(db, area_id, area)
    if db_area is None:
        raise HTTPException(status_code=404, detail="自习区域不存在")
    return db_area


@app.delete("/api/areas/{area_id}")
def delete_area(area_id: int, db: Session = Depends(get_db)):
    db_area = crud.delete_study_area(db, area_id)
    if db_area is None:
        raise HTTPException(status_code=404, detail="自习区域不存在")
    return {"message": "删除成功"}


@app.get("/api/seats", response_model=List[schemas.Seat])
def read_seats(area_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_seats(db, area_id=area_id, skip=skip, limit=limit)


@app.get("/api/seats/with-status", response_model=List[dict])
def read_seats_with_status(area_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_seats_with_status(db, area_id=area_id)


@app.get("/api/seats/{seat_id}", response_model=schemas.Seat)
def read_seat(seat_id: int, db: Session = Depends(get_db)):
    seat = crud.get_seat(db, seat_id)
    if seat is None:
        raise HTTPException(status_code=404, detail="座位不存在")
    return seat


@app.get("/api/seats/{seat_id}/time-slots")
def get_seat_time_slots(seat_id: int, date: str = Query(...), db: Session = Depends(get_db)):
    try:
        date_obj = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="日期格式错误")
    return crud.get_seat_time_slots(db, seat_id, date_obj)


@app.post("/api/seats", response_model=schemas.Seat)
def create_seat(seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    return crud.create_seat(db, seat)


@app.put("/api/seats/{seat_id}", response_model=schemas.Seat)
def update_seat(seat_id: int, seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    db_seat = crud.update_seat(db, seat_id, seat)
    if db_seat is None:
        raise HTTPException(status_code=404, detail="座位不存在")
    return db_seat


@app.delete("/api/seats/{seat_id}")
def delete_seat(seat_id: int, db: Session = Depends(get_db)):
    db_seat = crud.delete_seat(db, seat_id)
    if db_seat is None:
        raise HTTPException(status_code=404, detail="座位不存在")
    return {"message": "删除成功"}


@app.get("/api/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="用户名已存在")
    return crud.create_user(db, user)


@app.get("/api/reservations", response_model=List[schemas.Reservation])
def read_reservations(seat_id: Optional[int] = None, user_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reservations(db, seat_id=seat_id, user_id=user_id, skip=skip, limit=limit)


@app.get("/api/reservations/{reservation_id}", response_model=schemas.Reservation)
def read_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = crud.get_reservation(db, reservation_id)
    if reservation is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return reservation


@app.post("/api/reservations", response_model=schemas.Reservation)
def create_reservation(reservation: schemas.ReservationCreate, db: Session = Depends(get_db)):
    db_reservation = crud.create_reservation(db, reservation)
    if db_reservation is None:
        raise HTTPException(status_code=400, detail="该时间段座位已被预约")
    return db_reservation


@app.post("/api/reservations/{reservation_id}/cancel")
def cancel_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = crud.cancel_reservation(db, reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return {"message": "取消成功", "reservation": schemas.Reservation.model_validate(db_reservation)}


@app.post("/api/reservations/{reservation_id}/check-in")
def check_in_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = crud.check_in_reservation(db, reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="预约不存在")
    return {"message": "签到成功", "reservation": schemas.Reservation.model_validate(db_reservation)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
