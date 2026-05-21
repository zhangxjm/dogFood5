from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class StudyAreaBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = True


class StudyAreaCreate(StudyAreaBase):
    pass


class StudyArea(StudyAreaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SeatBase(BaseModel):
    seat_number: str = Field(..., min_length=1, max_length=20)
    area_id: int
    row: Optional[int] = 0
    col: Optional[int] = 0
    is_active: Optional[bool] = True
    has_power: Optional[bool] = False
    has_window: Optional[bool] = False


class SeatCreate(SeatBase):
    pass


class Seat(SeatBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SeatWithStatus(Seat):
    is_available: bool
    current_reservation: Optional["Reservation"] = None


class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: str = Field(..., min_length=1, max_length=100)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationBase(BaseModel):
    seat_id: int
    user_id: int
    start_time: datetime
    end_time: datetime


class ReservationCreate(ReservationBase):
    pass


class Reservation(ReservationBase):
    id: int
    status: str
    check_in_time: Optional[datetime] = None
    is_cancelled: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationWithDetails(Reservation):
    seat: Seat
    user: User


class TimeSlot(BaseModel):
    start_time: datetime
    end_time: datetime
    is_available: bool


class SeatAvailabilityResponse(BaseModel):
    seat: Seat
    time_slots: List[TimeSlot]
