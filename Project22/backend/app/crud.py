from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
from . import models, schemas


def get_study_area(db: Session, area_id: int):
    return db.query(models.StudyArea).filter(models.StudyArea.id == area_id).first()


def get_study_areas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.StudyArea).offset(skip).limit(limit).all()


def create_study_area(db: Session, area: schemas.StudyAreaCreate):
    db_area = models.StudyArea(**area.model_dump())
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area


def update_study_area(db: Session, area_id: int, area: schemas.StudyAreaCreate):
    db_area = get_study_area(db, area_id)
    if db_area:
        for key, value in area.model_dump().items():
            setattr(db_area, key, value)
        db.commit()
        db.refresh(db_area)
    return db_area


def delete_study_area(db: Session, area_id: int):
    db_area = get_study_area(db, area_id)
    if db_area:
        db.delete(db_area)
        db.commit()
    return db_area


def get_seat(db: Session, seat_id: int):
    return db.query(models.Seat).filter(models.Seat.id == seat_id).first()


def get_seats(db: Session, area_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Seat)
    if area_id:
        query = query.filter(models.Seat.area_id == area_id)
    return query.offset(skip).limit(limit).all()


def create_seat(db: Session, seat: schemas.SeatCreate):
    db_seat = models.Seat(**seat.model_dump())
    db.add(db_seat)
    db.commit()
    db.refresh(db_seat)
    return db_seat


def update_seat(db: Session, seat_id: int, seat: schemas.SeatCreate):
    db_seat = get_seat(db, seat_id)
    if db_seat:
        for key, value in seat.model_dump().items():
            setattr(db_seat, key, value)
        db.commit()
        db.refresh(db_seat)
    return db_seat


def delete_seat(db: Session, seat_id: int):
    db_seat = get_seat(db, seat_id)
    if db_seat:
        db.delete(db_seat)
        db.commit()
    return db_seat


def is_seat_available(db: Session, seat_id: int, start_time: datetime, end_time: datetime, exclude_reservation_id: int = None):
    query = db.query(models.Reservation).filter(
        models.Reservation.seat_id == seat_id,
        models.Reservation.is_cancelled == False,
        or_(
            and_(
                models.Reservation.start_time < end_time,
                models.Reservation.end_time > start_time
            )
        )
    )
    if exclude_reservation_id:
        query = query.filter(models.Reservation.id != exclude_reservation_id)
    return query.first() is None


def get_seat_current_reservation(db: Session, seat_id: int, check_time: datetime = None):
    if check_time is None:
        check_time = datetime.now()
    return db.query(models.Reservation).filter(
        models.Reservation.seat_id == seat_id,
        models.Reservation.is_cancelled == False,
        models.Reservation.start_time <= check_time,
        models.Reservation.end_time > check_time
    ).first()


def get_seats_with_status(db: Session, area_id: int = None, check_time: datetime = None):
    if check_time is None:
        check_time = datetime.now()
    seats = get_seats(db, area_id)
    result = []
    for seat in seats:
        reservation = get_seat_current_reservation(db, seat.id, check_time)
        seat_dict = schemas.Seat.model_validate(seat).model_dump()
        seat_dict["is_available"] = reservation is None
        seat_dict["current_reservation"] = schemas.Reservation.model_validate(reservation).model_dump() if reservation else None
        result.append(seat_dict)
    return result


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()


def get_reservations(db: Session, seat_id: int = None, user_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Reservation)
    if seat_id:
        query = query.filter(models.Reservation.seat_id == seat_id)
    if user_id:
        query = query.filter(models.Reservation.user_id == user_id)
    return query.order_by(models.Reservation.start_time.desc()).offset(skip).limit(limit).all()


def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    if not is_seat_available(db, reservation.seat_id, reservation.start_time, reservation.end_time):
        return None
    db_reservation = models.Reservation(**reservation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def cancel_reservation(db: Session, reservation_id: int):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        db_reservation.is_cancelled = True
        db.commit()
        db.refresh(db_reservation)
    return db_reservation


def check_in_reservation(db: Session, reservation_id: int):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        db_reservation.check_in_time = datetime.now()
        db_reservation.status = "checked_in"
        db.commit()
        db.refresh(db_reservation)
    return db_reservation


def get_expired_reservations(db: Session, timeout_minutes: int = 15):
    cutoff_time = datetime.now() - timedelta(minutes=timeout_minutes)
    return db.query(models.Reservation).filter(
        models.Reservation.is_cancelled == False,
        models.Reservation.check_in_time == None,
        models.Reservation.start_time <= cutoff_time,
        models.Reservation.status == "confirmed"
    ).all()


def release_expired_reservation(db: Session, reservation_id: int):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        db_reservation.is_cancelled = True
        db_reservation.status = "expired"
        db.commit()
        db.refresh(db_reservation)
    return db_reservation


def get_seat_time_slots(db: Session, seat_id: int, date: datetime):
    start_of_day = date.replace(hour=8, minute=0, second=0, microsecond=0)
    end_of_day = date.replace(hour=22, minute=0, second=0, microsecond=0)
    
    reservations = db.query(models.Reservation).filter(
        models.Reservation.seat_id == seat_id,
        models.Reservation.is_cancelled == False,
        models.Reservation.start_time < end_of_day,
        models.Reservation.end_time > start_of_day
    ).all()
    
    slots = []
    current_time = start_of_day
    reservation_index = 0
    
    sorted_reservations = sorted(reservations, key=lambda r: r.start_time)
    
    while current_time < end_of_day:
        slot_end = current_time + timedelta(hours=1)
        
        is_available = True
        for res in sorted_reservations:
            if (res.start_time < slot_end and res.end_time > current_time):
                is_available = False
                break
        
        slots.append({
            "start_time": current_time,
            "end_time": slot_end,
            "is_available": is_available
        })
        current_time = slot_end
    
    return slots
