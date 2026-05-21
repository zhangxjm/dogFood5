from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from models import RoomStatus, BookingStatus

class RoomTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    price_per_night: float
    max_guests: int
    amenities: Optional[str] = None

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomTypeUpdate(RoomTypeBase):
    pass

class RoomType(RoomTypeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    room_number: str
    room_type_id: int
    floor: Optional[int] = None
    status: RoomStatus = RoomStatus.AVAILABLE
    notes: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    room_type: Optional[RoomType] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    id_card: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    num_guests: int
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_id_card: Optional[str] = None
    room_id: int

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None

class CheckInRequest(BaseModel):
    booking_id: int

class CheckOutRequest(BaseModel):
    booking_id: int

class Booking(BookingBase):
    id: int
    booking_no: str
    customer: Customer
    room: Room
    total_price: float
    status: BookingStatus
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookingWithDetails(Booking):
    pass

class RoomAvailabilityCheck(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    room_type_id: Optional[int] = None

class AvailableRoomResponse(BaseModel):
    room: Room
    is_available: bool

class BookingConflictResponse(BaseModel):
    has_conflict: bool
    conflicting_bookings: List[Booking]
