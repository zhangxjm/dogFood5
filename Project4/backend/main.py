from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import models
import schemas
import crud
from database import engine, SessionLocal, get_db

models.Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        room_types_count = db.query(models.RoomType).count()
        if room_types_count == 0:
            initial_room_types = [
                models.RoomType(name="标准单人间", description="舒适的单人客房，配备基本设施", price_per_night=199.00, max_guests=1, amenities="空调,电视,免费WiFi,独立卫浴"),
                models.RoomType(name="标准双人间", description="温馨的双人客房，配备两张单人床", price_per_night=299.00, max_guests=2, amenities="空调,电视,免费WiFi,独立卫浴,电吹风"),
                models.RoomType(name="豪华大床房", description="宽敞的豪华客房，配备一张大床", price_per_night=499.00, max_guests=2, amenities="空调,智能电视,免费WiFi,独立卫浴,迷你吧,保险箱"),
                models.RoomType(name="家庭套房", description="适合家庭入住的套房，包含客厅和卧室", price_per_night=699.00, max_guests=4, amenities="空调,智能电视,免费WiFi,独立卫浴,迷你吧,保险箱,沙发"),
                models.RoomType(name="总统套房", description="顶级豪华套房，提供至尊享受", price_per_night=1299.00, max_guests=2, amenities="空调,智能电视,免费WiFi,独立浴缸,迷你吧,保险箱,客厅,餐厅"),
            ]
            db.add_all(initial_room_types)
            db.commit()
            print("✅ 初始化房型数据成功")
        
        rooms_count = db.query(models.Room).count()
        if rooms_count == 0:
            initial_rooms = [
                models.Room(room_number="101", room_type_id=1, floor=1, status="available"),
                models.Room(room_number="102", room_type_id=1, floor=1, status="available"),
                models.Room(room_number="103", room_type_id=2, floor=1, status="available"),
                models.Room(room_number="104", room_type_id=2, floor=1, status="available"),
                models.Room(room_number="201", room_type_id=2, floor=2, status="available"),
                models.Room(room_number="202", room_type_id=3, floor=2, status="available"),
                models.Room(room_number="203", room_type_id=3, floor=2, status="available"),
                models.Room(room_number="301", room_type_id=4, floor=3, status="available"),
                models.Room(room_number="302", room_type_id=4, floor=3, status="available"),
                models.Room(room_number="401", room_type_id=5, floor=4, status="available"),
            ]
            db.add_all(initial_rooms)
            db.commit()
            print("✅ 初始化房间数据成功")
    except Exception as e:
        print(f"⚠️ 初始化数据失败: {e}")
        db.rollback()
    finally:
        db.close()

init_db()

app = FastAPI(title="酒店房间预订系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "酒店房间预订系统 API", "version": "1.0.0"}

@app.get("/room-types/", response_model=List[schemas.RoomType])
def read_room_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_room_types(db, skip=skip, limit=limit)

@app.get("/room-types/{room_type_id}", response_model=schemas.RoomType)
def read_room_type(room_type_id: int, db: Session = Depends(get_db)):
    db_room_type = crud.get_room_type(db, room_type_id=room_type_id)
    if db_room_type is None:
        raise HTTPException(status_code=404, detail="房型不存在")
    return db_room_type

@app.post("/room-types/", response_model=schemas.RoomType)
def create_room_type(room_type: schemas.RoomTypeCreate, db: Session = Depends(get_db)):
    db_room_type = crud.get_room_type_by_name(db, name=room_type.name)
    if db_room_type:
        raise HTTPException(status_code=400, detail="该房型名称已存在")
    return crud.create_room_type(db=db, room_type=room_type)

@app.put("/room-types/{room_type_id}", response_model=schemas.RoomType)
def update_room_type(room_type_id: int, room_type: schemas.RoomTypeUpdate, db: Session = Depends(get_db)):
    db_room_type = crud.update_room_type(db, room_type_id=room_type_id, room_type=room_type)
    if db_room_type is None:
        raise HTTPException(status_code=404, detail="房型不存在")
    return db_room_type

@app.delete("/room-types/{room_type_id}")
def delete_room_type(room_type_id: int, db: Session = Depends(get_db)):
    try:
        db_room_type = crud.delete_room_type(db, room_type_id=room_type_id)
        if db_room_type is None:
            raise HTTPException(status_code=404, detail="房型不存在")
        return {"message": "删除成功"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/rooms/", response_model=List[schemas.Room])
def read_rooms(
    skip: int = 0, 
    limit: int = 100, 
    room_type_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_rooms(db, skip=skip, limit=limit, room_type_id=room_type_id, status=status)

@app.get("/rooms/available", response_model=List[schemas.Room])
def read_available_rooms(
    check_in_date: datetime = Query(...),
    check_out_date: datetime = Query(...),
    room_type_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return crud.get_available_rooms(db, check_in_date=check_in_date, check_out_date=check_out_date, room_type_id=room_type_id)

@app.get("/rooms/{room_id}", response_model=schemas.Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="房间不存在")
    return db_room

@app.post("/rooms/", response_model=schemas.Room)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    db_room = crud.get_room_by_number(db, room_number=room.room_number)
    if db_room:
        raise HTTPException(status_code=400, detail="该房间号已存在")
    return crud.create_room(db=db, room=room)

@app.put("/rooms/{room_id}", response_model=schemas.Room)
def update_room(room_id: int, room: schemas.RoomUpdate, db: Session = Depends(get_db)):
    db_room = crud.update_room(db, room_id=room_id, room=room)
    if db_room is None:
        raise HTTPException(status_code=404, detail="房间不存在")
    return db_room

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    try:
        db_room = crud.delete_room(db, room_id=room_id)
        if db_room is None:
            raise HTTPException(status_code=404, detail="房间不存在")
        return {"message": "删除成功"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/bookings/", response_model=List[schemas.Booking])
def read_bookings(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    room_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return crud.get_bookings(db, skip=skip, limit=limit, status=status, room_id=room_id)

@app.get("/bookings/{booking_id}", response_model=schemas.Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = crud.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="预订不存在")
    return db_booking

@app.post("/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_booking(db=db, booking=booking)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/bookings/{booking_id}/confirm", response_model=schemas.Booking)
def confirm_booking_endpoint(booking_id: int, db: Session = Depends(get_db)):
    try:
        db_booking = crud.confirm_booking(db, booking_id=booking_id)
        if db_booking is None:
            raise HTTPException(status_code=404, detail="预订不存在")
        return db_booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/bookings/check-in", response_model=schemas.Booking)
def check_in_endpoint(request: schemas.CheckInRequest, db: Session = Depends(get_db)):
    try:
        db_booking = crud.check_in(db, booking_id=request.booking_id)
        if db_booking is None:
            raise HTTPException(status_code=404, detail="预订不存在")
        return db_booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/bookings/check-out", response_model=schemas.Booking)
def check_out_endpoint(request: schemas.CheckOutRequest, db: Session = Depends(get_db)):
    try:
        db_booking = crud.check_out(db, booking_id=request.booking_id)
        if db_booking is None:
            raise HTTPException(status_code=404, detail="预订不存在")
        return db_booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/bookings/{booking_id}/cancel", response_model=schemas.Booking)
def cancel_booking_endpoint(booking_id: int, db: Session = Depends(get_db)):
    try:
        db_booking = crud.cancel_booking(db, booking_id=booking_id)
        if db_booking is None:
            raise HTTPException(status_code=404, detail="预订不存在")
        return db_booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_customers(db, skip=skip, limit=limit)

@app.get("/stats/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_rooms = db.query(models.Room).count()
    occupied_rooms = db.query(models.Room).filter(models.Room.status == models.RoomStatus.OCCUPIED).count()
    available_rooms = db.query(models.Room).filter(models.Room.status == models.RoomStatus.AVAILABLE).count()
    reserved_rooms = db.query(models.Room).filter(models.Room.status == models.RoomStatus.RESERVED).count()
    
    today = datetime.now().date()
    today_bookings = db.query(models.Booking).filter(
        models.Booking.check_in_date <= datetime.combine(today, datetime.max.time()),
        models.Booking.check_out_date >= datetime.combine(today, datetime.min.time()),
        models.Booking.status.in_([models.BookingStatus.CONFIRMED, models.BookingStatus.CHECKED_IN])
    ).count()
    
    total_bookings = db.query(models.Booking).count()
    checked_in_bookings = db.query(models.Booking).filter(models.Booking.status == models.BookingStatus.CHECKED_IN).count()
    
    return {
        "total_rooms": total_rooms,
        "occupied_rooms": occupied_rooms,
        "available_rooms": available_rooms,
        "reserved_rooms": reserved_rooms,
        "today_bookings": today_bookings,
        "total_bookings": total_bookings,
        "checked_in_bookings": checked_in_bookings
    }
