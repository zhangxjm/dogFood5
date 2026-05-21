from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
import uuid
import models
import schemas

def get_room_type(db: Session, room_type_id: int):
    return db.query(models.RoomType).filter(models.RoomType.id == room_type_id).first()

def get_room_type_by_name(db: Session, name: str):
    return db.query(models.RoomType).filter(models.RoomType.name == name).first()

def get_room_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.RoomType).offset(skip).limit(limit).all()

def create_room_type(db: Session, room_type: schemas.RoomTypeCreate):
    db_room_type = models.RoomType(**room_type.model_dump())
    db.add(db_room_type)
    db.commit()
    db.refresh(db_room_type)
    return db_room_type

def update_room_type(db: Session, room_type_id: int, room_type: schemas.RoomTypeUpdate):
    db_room_type = get_room_type(db, room_type_id)
    if db_room_type:
        for key, value in room_type.model_dump().items():
            setattr(db_room_type, key, value)
        db.commit()
        db.refresh(db_room_type)
    return db_room_type

def delete_room_type(db: Session, room_type_id: int):
    db_room_type = get_room_type(db, room_type_id)
    if db_room_type:
        rooms_count = db.query(models.Room).filter(models.Room.room_type_id == room_type_id).count()
        if rooms_count > 0:
            raise ValueError(f"该房型下还有 {rooms_count} 个房间，无法删除。请先删除或修改这些房间。")
        db.delete(db_room_type)
        db.commit()
    return db_room_type

def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_room_by_number(db: Session, room_number: str):
    return db.query(models.Room).filter(models.Room.room_number == room_number).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100, room_type_id: int = None, status: str = None):
    query = db.query(models.Room)
    if room_type_id:
        query = query.filter(models.Room.room_type_id == room_type_id)
    if status:
        query = query.filter(models.Room.status == status)
    return query.offset(skip).limit(limit).all()

def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room(db: Session, room_id: int, room: schemas.RoomUpdate):
    db_room = get_room(db, room_id)
    if db_room:
        for key, value in room.model_dump().items():
            setattr(db_room, key, value)
        db.commit()
        db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    db_room = get_room(db, room_id)
    if db_room:
        bookings_count = db.query(models.Booking).filter(models.Booking.room_id == room_id).count()
        if bookings_count > 0:
            raise ValueError(f"该房间下还有 {bookings_count} 个预订记录，无法删除。请先删除或取消相关预订。")
        db.delete(db_room)
        db.commit()
    return db_room

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customer_by_phone(db: Session, phone: str):
    return db.query(models.Customer).filter(models.Customer.phone == phone).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_or_create_customer(db: Session, customer_data: schemas.CustomerCreate):
    db_customer = get_customer_by_phone(db, customer_data.phone)
    if db_customer:
        return db_customer
    return create_customer(db, customer_data)

def check_booking_conflict(db: Session, room_id: int, check_in_date: datetime, check_out_date: datetime, exclude_booking_id: int = None):
    query = db.query(models.Booking).filter(
        models.Booking.room_id == room_id,
        models.Booking.status.in_([
            models.BookingStatus.CONFIRMED,
            models.BookingStatus.CHECKED_IN
        ]),
        or_(
            and_(
                models.Booking.check_in_date <= check_in_date,
                models.Booking.check_out_date > check_in_date
            ),
            and_(
                models.Booking.check_in_date < check_out_date,
                models.Booking.check_out_date >= check_out_date
            ),
            and_(
                models.Booking.check_in_date >= check_in_date,
                models.Booking.check_out_date <= check_out_date
            )
        )
    )
    if exclude_booking_id:
        query = query.filter(models.Booking.id != exclude_booking_id)
    return query.all()

def calculate_total_price(db: Session, room_id: int, check_in_date: datetime, check_out_date: datetime):
    room = get_room(db, room_id)
    if not room:
        return 0
    room_type = room.room_type
    if not room_type:
        return 0
    days = (check_out_date - check_in_date).days
    if days <= 0:
        days = 1
    return room_type.price_per_night * days

def generate_booking_no():
    return f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4].upper()}"

def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def get_booking_by_no(db: Session, booking_no: str):
    return db.query(models.Booking).filter(models.Booking.booking_no == booking_no).first()

def get_bookings(db: Session, skip: int = 0, limit: int = 100, status: str = None, room_id: int = None):
    query = db.query(models.Booking)
    if status:
        query = query.filter(models.Booking.status == status)
    if room_id:
        query = query.filter(models.Booking.room_id == room_id)
    return query.order_by(models.Booking.created_at.desc()).offset(skip).limit(limit).all()

def create_booking(db: Session, booking: schemas.BookingCreate):
    conflicts = check_booking_conflict(db, booking.room_id, booking.check_in_date, booking.check_out_date)
    if conflicts:
        raise ValueError("该房间在所选时间段内已被预订")
    
    if booking.check_out_date <= booking.check_in_date:
        raise ValueError("退房日期必须晚于入住日期")
    
    customer_data = schemas.CustomerCreate(
        name=booking.customer_name,
        phone=booking.customer_phone,
        email=booking.customer_email,
        id_card=booking.customer_id_card
    )
    customer = get_or_create_customer(db, customer_data)
    
    total_price = calculate_total_price(db, booking.room_id, booking.check_in_date, booking.check_out_date)
    
    db_booking = models.Booking(
        booking_no=generate_booking_no(),
        customer_id=customer.id,
        room_id=booking.room_id,
        check_in_date=booking.check_in_date,
        check_out_date=booking.check_out_date,
        num_guests=booking.num_guests,
        total_price=total_price,
        status=models.BookingStatus.PENDING,
        notes=booking.notes
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def confirm_booking(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    if db_booking.status != models.BookingStatus.PENDING:
        raise ValueError("只有待确认的预订可以确认")
    
    db_booking.status = models.BookingStatus.CONFIRMED
    room = db_booking.room
    if room.status == models.RoomStatus.AVAILABLE:
        room.status = models.RoomStatus.RESERVED
    db.commit()
    db.refresh(db_booking)
    return db_booking

def check_in(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    if db_booking.status != models.BookingStatus.CONFIRMED:
        raise ValueError("只有已确认的预订可以办理入住")
    
    db_booking.status = models.BookingStatus.CHECKED_IN
    db_booking.check_in_time = datetime.now()
    
    room = db_booking.room
    room.status = models.RoomStatus.OCCUPIED
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

def check_out(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    if db_booking.status != models.BookingStatus.CHECKED_IN:
        raise ValueError("只有已入住的预订可以办理退房")
    
    db_booking.status = models.BookingStatus.CHECKED_OUT
    db_booking.check_out_time = datetime.now()
    
    room = db_booking.room
    room.status = models.RoomStatus.AVAILABLE
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

def cancel_booking(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    if db_booking.status in [models.BookingStatus.CHECKED_IN, models.BookingStatus.CHECKED_OUT]:
        raise ValueError("已入住或已退房的预订无法取消")
    
    db_booking.status = models.BookingStatus.CANCELLED
    
    room = db_booking.room
    has_other_confirmed = db.query(models.Booking).filter(
        models.Booking.room_id == room.id,
        models.Booking.status == models.BookingStatus.CONFIRMED,
        models.Booking.id != booking_id
    ).first()
    if not has_other_confirmed and room.status == models.RoomStatus.RESERVED:
        room.status = models.RoomStatus.AVAILABLE
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_available_rooms(db: Session, check_in_date: datetime, check_out_date: datetime, room_type_id: int = None):
    query = db.query(models.Room).filter(models.Room.status == models.RoomStatus.AVAILABLE)
    if room_type_id:
        query = query.filter(models.Room.room_type_id == room_type_id)
    
    available_rooms = []
    for room in query.all():
        conflicts = check_booking_conflict(db, room.id, check_in_date, check_out_date)
        if not conflicts:
            available_rooms.append(room)
    
    return available_rooms
